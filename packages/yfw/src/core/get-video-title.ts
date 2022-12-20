import { spawn } from "node:child_process";

/**
 * This is going to produce the video identifier that will be used in all other functions.
 *
 * eg., returns VideoTitleWithoutSymbols.mp4
 */
export async function getVideoTitle(url: string): Promise<VideoID> {
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
        resolve(videoTitle.toString());
      } else {
        reject("no video title");
      }
    });
  });
}
