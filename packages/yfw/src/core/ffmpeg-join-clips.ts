import { spawn } from "node:child_process";
import fs from "node:fs";
import { aggregateVideosPath } from "./constants";
import { getTrimmedVideos } from "./data-access/get-file";

function writeClipsToTxt(clips: VideoID[], name: string): string {
  const fileName = `${aggregateVideosPath}/${name}.txt`;
  const clipPaths = clips.map((clip) => {
    return `file '${getTrimmedVideos(clip)}'`;
  });
  console.log(clipPaths);
  fs.writeFileSync(fileName, clipPaths.join("\n"));
  return fileName;
}

/**
 *
 * @param clips list of video ideas
 * @returns
 */
export function joinClips(clips: VideoID[], name: string): Promise<string> {
  // todo, check if name already exists...
  const inputName = writeClipsToTxt(clips, name);
  return new Promise((resolve, reject) => {
    const outputName = `${aggregateVideosPath}/${name}.mp4`;
    const programName = "ffmpeg";
    // https://stackoverflow.com/questions/7333232/how-to-concatenate-two-mp4-files-using-ffmpeg
    const args: string[] = [
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      inputName,
      "-c:v",
      "copy",
      "-c:a",
      "aac",
      outputName,
    ];

    console.log(`Running --${programName} ${args.join(" ")}`);

    const ffmpegJoinProcess = spawn(programName, args);

    ffmpegJoinProcess.stdout.on("data", (data: any) => {
      console.log(`stdout: ${data}`);
    });

    ffmpegJoinProcess.stderr.on("data", (data: any) => {
      console.error(`stderr: ${data}`);
      if (data.toString().includes("already exists")) {
        reject();
      }
    });

    ffmpegJoinProcess.on("close", (code: number) => {
      if (code === 0) {
        resolve(outputName);
      } else {
        reject();
      }
    });
  });
}
