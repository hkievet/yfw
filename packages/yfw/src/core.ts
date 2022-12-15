import command from "commander";
import path from "path";

const { spawn } = require("child_process");
const fs = require("node:fs");

const pathToProcessDir = path.join(__dirname, "..", "..", "..", "process");

export function stripSymbolsAndSpaces(title: string) {
  var newTitle = title
    .replace(/[^\w\s]/gi, "")
    .split(" ")
    .join("");
  return newTitle;
}

export async function getYoutubeVideoTitle(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const args = ["--get-title", url];
    console.log("Running yt-dlp", args.join(" "));
    const youtubeVideoTitle = spawn("yt-dlp", args);
    let videoTitle = "";

    youtubeVideoTitle.stdout.on("data", (data: any) => {
      console.log(`stdout: ${data}`);
      videoTitle = data;
    });

    youtubeVideoTitle.stderr.on("data", (data: any) => {
      console.error(`stderr: ${data}`);
    });

    youtubeVideoTitle.on("close", (code: number) => {
      console.log(
        `child process exited with code ${code}, title: ${videoTitle}`
      );
      if (videoTitle && code === 0) {
        const fixedtitle = stripSymbolsAndSpaces(videoTitle.toString()).trim();
        resolve(fixedtitle);
      } else {
        reject("no video title");
      }
    });
  });
}

export function downloadYoutubeVideo(
  url: string,
  title: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const fp = `${pathToProcessDir}/videos/${title}.mp4`;
    const args = ["-f best[ext=mp4]", `-o`, fp, url];
    console.log(`yt-dlp`, args.join(" "));
    const youtubeDl = spawn("yt-dlp", args);

    youtubeDl.stdout.on("data", (data: any) => {
      console.log(`stdout: ${data}`);
    });

    youtubeDl.stderr.on("data", (data: any) => {
      console.error(`stderr: ${data}`);
    });

    youtubeDl.on("close", (code: any) => {
      if (code === 0) {
        console.log(`child process exited with code ${code}`);
        resolve(fp);
      } else {
        reject("Failed to download youtube video");
      }
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
      pathToProcessDir + "/output",
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

    whisperProc.on("close", (code: number) => {
      if (code === 0) {
        console.log(`child process exited with code ${code}`);
        resolve();
      } else {
        reject("Failed to transcribe video");
      }
    });
  });
}

interface SRTLineSegment {
  text: string;
  startTime: string;
  endTime: string;
}

export function readSRT(videoName: string): SRTLineSegment[] {
  // should be figured out and calculatable...
  const srtFile = `${pathToProcessDir}/output/${videoName}.srt`;
  const file = fs.readFileSync(srtFile).toString();
  const lines = file.split("\n");
  const segments: SRTLineSegment[] = [];
  const regex = /^\d+$/;
  lines.forEach((line: string, i: number) => {
    if (regex.test(line)) {
      const time = lines[i + 1];
      const text = lines[i + 2];
      let [startTime, endTime] = time.split(" --> ");

      segments.push({ text, startTime, endTime });
    }
  });

  return segments;
}

export function readAndParseSRT(
  videoName: string,
  start: number,
  end: number
): SRTLineSegment {
  const segments = readSRT(videoName);
  // should be figured out and calculatable..
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

export async function trimVideo(
  video: string,
  start: number,
  end: number
): Promise<string> {
  const { startTime, endTime, text } = readAndParseSRT(video, start, end);
  return await ffmpegMakeClip(video, startTime, endTime, text);
}

export function ffmpegMakeClip(
  video: string,
  startTime: string,
  endTime: string,
  text: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const words = text.split(" ");
    const fileName = words[0] + words[words.length - 1] + video;
    const videoFp = `${pathToProcessDir}/videos/${video}`;
    const outputFp = `${pathToProcessDir}/trimmed/${fileName}`;
    const args = [
      "-i",
      videoFp,
      "-ss",
      startTime,
      "-to",
      endTime,
      `${pathToProcessDir}/trimmed/${fileName}`,
    ];
    console.log(args.join(" "));
    const ffmpegMakeClipProc = spawn("ffmpeg", args);

    ffmpegMakeClipProc.stdout.on("data", (data: any) => {
      console.log(`stdout: ${data}`);
    });

    ffmpegMakeClipProc.stderr.on("data", (data: any) => {
      console.error(`stderr: ${data}`);
    });

    ffmpegMakeClipProc.on("close", (code: number) => {
      console.log(`child process exited with code ${code}`);
      if (code === 1) {
        reject("error trimming clip");
      } else {
        resolve(outputFp);
      }
    });
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
