import { spawn } from "node:child_process";
import { pathToProcessDir } from "./constants";
import { TimeStamp, timeStampToString } from "./timestamp-utils";

/**
 * Trims a video at a given startTime and endTime
 *
 * @param video the name of the video file (not path) for the subclip to be made from
 * @param startTime hh:mm:ss.ms
 * @param endTime hh:mm:ss.ss
 * @param text text assumed to be found within the intervals given
 * @returns the absolute filepath to the generated sublip
 */
export function ffmpegMakeClip(
  video: VideoID,
  startTime: TimeStamp,
  endTime: TimeStamp,
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
      timeStampToString(startTime),
      "-to",
      timeStampToString(endTime),
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
