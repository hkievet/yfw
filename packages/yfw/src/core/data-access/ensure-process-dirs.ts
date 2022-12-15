import {
  aggregateVideosPath,
  downloadedVideosPath,
  generatedTranscriptsPath,
  pathToProcessDir,
  trimmedVideosPath,
} from "../constants";
import fs from "node:fs";

export function ensureProcessDirs() {
  const dirs = [
    pathToProcessDir,
    downloadedVideosPath,
    generatedTranscriptsPath,
    trimmedVideosPath,
    aggregateVideosPath,
  ];
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  });
}
