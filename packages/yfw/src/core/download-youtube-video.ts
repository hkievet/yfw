import { spawn } from "node:child_process";
import { pathToProcessDir } from "./constants";

/**
 * Downloads a video using yt-dlp
 *
 * @param url youtube url of the video
 * @param title the name of the file
 * @returns the actual file to the video downloaded (full path).
 */
export function downloadYoutubeVideo(
  url: string,
  title: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const fp = `${pathToProcessDir}/videos/${title}`;
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
