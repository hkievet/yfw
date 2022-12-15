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
