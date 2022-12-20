import { spawn } from "node:child_process";

export async function ffmpegGetVideoLength(): Promise<number> {
  return new Promise((resolve, reject) => {
    let duration = 0;
    const cmd = "ffmpeg";
    const args = [
      "-i",
      "DeathGripsOnGP.mp4",
      "-show_format",
      "-v",
      "quiet",
      "|",
      "grep",
      "duration",
    ];
    const ffmpegProcess = spawn("cmd", args);

    ffmpegProcess.stdout.on("data", (data: any) => {
      // sample output "duration=367.618300";
      const dataString = `${data}`.split("=");
      if (dataString.length === 2 && dataString[0] === "duration") {
        duration = Math.floor(Number.parseFloat(dataString[1]) * 1000);
      }
    });

    ffmpegProcess.stderr.on("data", (data: any) => {
      console.error(`stderr: data`);
    });

    ffmpegProcess.on("close", (code: number) => {
      if (code === 0 && duration) {
        resolve(duration);
      } else {
        reject();
      }
    });
  });
}
