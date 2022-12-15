import { spawn } from "child_process";
import { pathToProcessDir } from "./constants";

/**
 *
 * @param inputFile
 * @returns
 */
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
