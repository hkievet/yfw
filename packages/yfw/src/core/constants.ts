import path from "node:path";

/**
 * Hard coded path.  This is where all the files are to be worked with
 */
export const pathToProcessDir = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "..",
  "process"
);

export const downloadedVideosPath = pathToProcessDir + "/videos";
export const generatedTranscriptsPath = pathToProcessDir + "/output";
export const trimmedVideosPath = pathToProcessDir + "/trimmed";
export const aggregateVideosPath = pathToProcessDir + "/aggregate";

export interface ProcessFilePathConsts {
  downloadedVideosPath: string;
  generatedTranscriptsPath: string;
  trimmedVideosPath: string;
  aggregateVideosPath: string;
  pathToProcessDir: string;
}

const processFilePaths = {
  downloadedVideosPath,
  generatedTranscriptsPath,
  trimmedVideosPath,
  aggregateVideosPath,
  pathToProcessDir,
};

export function getProcessFilePaths(): ProcessFilePathConsts {
  return { ...processFilePaths };
}
