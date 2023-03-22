import { spawn } from "node:child_process";

export async function ffmpegGetVideoLength(videoPath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    let duration = 0;
    const cmd = "sh";
    const shCmd = `ffprobe -i ${videoPath} -show_format -v quiet | grep duration`;
    const args = [
      "-c",
      shCmd,
      // "ffprobe",
      // "-i",
      // videoPath,
      // "-show_format",
      // "-v",
      // "quiet",
      // "|",
      // "grep",
      // "duration",
    ];

    const ffmpegProcess = spawn(cmd, args);

    ffmpegProcess.stdout.on("data", (data: any) => {
      console.log(`${data}`);
      const dataString = `${data}`.split("=");
      if (dataString.length === 2 && dataString[0] === "duration") {
        duration = Math.floor(Number.parseFloat(dataString[1]) * 10000);
      }
    });

    ffmpegProcess.stderr.on("data", (data: any) => {
      console.error(`stderr: ${data}`);
    });

    ffmpegProcess.on("close", (code: number) => {
      if (code === 0) {
        if (duration) {
          resolve(duration);
        }
        resolve(-1);
      } else {
        reject(code);
      }
    });
  });
}
