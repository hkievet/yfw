#!/usr/bin/env node
const command = require("commander");
const program = new command.Command();
const { spawn } = require("child_process");
const fs = require("node:fs");
const { request } = require("http");

function stripSymbolsAndSpaces(title) {
  var newTitle = title
    .replace(/[^\w\s]/gi, "")
    .split(" ")
    .join("");
  return newTitle;
}

async function getYoutubeVideoTitle(url) {
  return new Promise((resolve, reject) => {
    const youtubeVideoTitle = spawn("youtube-dl", ["--get-title", url]);
    let videoTitle = "";

    youtubeVideoTitle.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
      videoTitle = data;
    });

    youtubeVideoTitle.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
      reject("Error running Process");
    });

    youtubeVideoTitle.on("close", (code) => {
      console.log(
        `child process exited with code ${code}, title: ${videoTitle}`
      );
      if (videoTitle) {
        const fixedtitle = stripSymbolsAndSpaces(videoTitle.toString()).trim();
        resolve(fixedtitle);
      }
      reject("no video title");
    });
  });
}

function downloadYoutubeVideo(url, title) {
  return new Promise((resolve, reject) => {
    const fp = `process/videos/${title}.mp4`;
    const youtubeDl = spawn("youtube-dl", ["-f best[ext=mp4]", `-o`, fp, url]);

    youtubeDl.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    youtubeDl.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
      reject(data);
    });

    youtubeDl.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
      resolve(fp);
    });
  });
}

function runWhisperOnFile(inputFile) {
  return new Promise((resolve, reject) => {
    const args = [
      inputFile,
      "--model",
      "base.en",
      "--output_dir",
      "./process/output",
    ];
    console.log("whisper" + " " + args.join(" "));

    const whisperProc = spawn("whisper", args);

    whisperProc.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    whisperProc.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
      //   reject(data)
    });

    whisperProc.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
      resolve();
    });
  });
}

function readAndParseSRT(videoName, start, end) {
  const srtFile = `process/output/${videoName}.mp4.srt`;
  const file = fs.readFileSync(srtFile).toString();
  const lines = file.split("\n");
  const segments = [];
  const regex = /^\d+$/;
  lines.forEach((line, i) => {
    if (regex.test(line)) {
      const time = lines[i + 1];
      const text = lines[i + 2];
      let [startTime, endTime] = time.split(" --> ");

      segments.push({ text, startTime, endTime });
    }
  });

  const requestedSegments = segments.slice(start - 1, end);
  const combinedText = requestedSegments
    .map((segment) => segment.text)
    .join(" ");

  // start 1 second earlier and end 1 second earlier.
  // 00:03:31 these are shaped like this:
  let startTime = requestedSegments[0].startTime;
  let [hhmmss, ms] = startTime.split(",");
  let [hh, mm, ss] = hhmmss.split(":");
  ss = String(Number.parseInt(ss) - 1).padStart(2, "0");
  startTime = `${[hh, mm, ss].join(":")}.${ms}`;

  let endTime = requestedSegments[requestedSegments.length - 1].endTime;
  [hhmmss, ms] = endTime.split(",");
  [hh, mm, ss] = endTime.split(":");
  ss = String(Number.parseInt(ss) + 1).padStart(2, "0");
  endTime = `${[hh, mm, ss].join(":")}.${ms}`;

  console.log(startTime, " - ", endTime);

  return {
    startTime,
    endTime,
    text: combinedText,
  };
}

function ffmpegMakeClip(video, startTime, endTime, text) {
  const words = text.split(" ");
  const fileName = words[0] + words[words.length - 1] + video + ".mp4";
  const videoFp = `process/videos/${video}.mp4`;
  const args = [
    "-i",
    videoFp,
    "-ss",
    startTime,
    "-to",
    endTime,
    `process/trimmed/${fileName}`,
  ];
  console.log(args.join(" "));
  const ffmpegMakeClipProc = spawn("ffmpeg", args);

  ffmpegMakeClipProc.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  ffmpegMakeClipProc.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  ffmpegMakeClipProc.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

program
  .command("start")
  .option("--url <youtubeUrl>", "The youtube url to donwload")
  .action(async function ({ url }) {
    // downloadYoutubeVideo(url)
    const title = await getYoutubeVideoTitle(url);
    const fp = await downloadYoutubeVideo(url, title);
    const finished = await runWhisperOnFile(fp);
  });

program
  .command("strip")
  .option("--v <value>", "The value to strip")
  .action(({ v }) => {
    console.log(stripSymbolsAndSpaces(v));
  });

program
  .command("startWhisper")
  .option(
    "--file <filepath>",
    "path to the file you want to convert to whisper"
  )
  .action(async ({ file }) => {
    console.log(file);
    await runWhisperOnFile(file);
  });

program
  .command("trimVideo")
  .option("--video <string>", "Name of video you care about")
  .option("--start <number>", "Start number in the srt")
  .option("--end <number>", "End position in srt")
  .action(({ video, start, end }) => {
    const { startTime, endTime, text } = readAndParseSRT(video, start, end);
    ffmpegMakeClip(video, startTime, endTime, text);
  });

program.parse(process.argv);
