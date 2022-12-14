import command from "commander";

const program = new command.Command();
const { spawn } = require("child_process");
const fs = require("node:fs");

export function stripSymbolsAndSpaces(title: string) {
  var newTitle = title
    .replace(/[^\w\s]/gi, "")
    .split(" ")
    .join("");
  return newTitle;
}

export async function getYoutubeVideoTitle(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const youtubeVideoTitle = spawn("yt-dlp", ["--get-title", url]);
    let videoTitle = "";

    youtubeVideoTitle.stdout.on("data", (data: any) => {
      console.log(`stdout: ${data}`);
      videoTitle = data;
    });

    youtubeVideoTitle.stderr.on("data", (data: any) => {
      console.error(`stderr: ${data}`);
      reject("Error running Process");
    });

    youtubeVideoTitle.on("close", (code: any) => {
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

export function downloadYoutubeVideo(
  url: string,
  title: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const fp = `process/videos/${title}.mp4`;
    const youtubeDl = spawn("yt-dlp", ["-f best[ext=mp4]", `-o`, fp, url]);

    youtubeDl.stdout.on("data", (data: any) => {
      console.log(`stdout: ${data}`);
    });

    youtubeDl.stderr.on("data", (data: any) => {
      console.error(`stderr: ${data}`);
      reject(data);
    });

    youtubeDl.on("close", (code: any) => {
      console.log(`child process exited with code ${code}`);
      resolve(fp);
    });
  });
}

export function runWhisperOnFile(inputFile: string): Promise<void> {
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

    whisperProc.stdout.on("data", (data: any) => {
      console.log(`stdout: ${data}`);
    });

    whisperProc.stderr.on("data", (data: any) => {
      console.error(`stderr: ${data}`);
      //   reject(data)
    });

    whisperProc.on("close", (code: string) => {
      console.log(`child process exited with code ${code}`);
      resolve();
    });
  });
}

interface SRTLine {
  text: string;
  startTime: string;
  endTime: string;
}

export function readAndParseSRT(
  videoName: string,
  start: number,
  end: number
): SRTLine {
  // should be figured out and calculatable...
  const srtFile = `process/output/${videoName}.mp4.srt`;
  const file = fs.readFileSync(srtFile).toString();
  const lines = file.split("\n");
  const segments: SRTLine[] = [];
  const regex = /^\d+$/;
  lines.forEach((line: string, i: number) => {
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

export function ffmpegMakeClip(
  video: string,
  startTime: string,
  endTime: string,
  text: string
) {
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

  ffmpegMakeClipProc.stdout.on("data", (data: any) => {
    console.log(`stdout: ${data}`);
  });

  ffmpegMakeClipProc.stderr.on("data", (data: any) => {
    console.error(`stderr: ${data}`);
  });

  ffmpegMakeClipProc.on("close", (code: string) => {
    console.log(`child process exited with code ${code}`);
  });
}

export async function startFullProcess(url: string) {
  try {
    const title = await getYoutubeVideoTitle(url);
    const fp = await downloadYoutubeVideo(url, title);
    const finished = await runWhisperOnFile(fp);
  } catch (e) {
    console.error(e);
  }
}
