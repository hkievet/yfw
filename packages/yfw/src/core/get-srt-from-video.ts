import { pathToProcessDir } from "./constants";
import fs from "node:fs";
import { TimeStamp, timeStampFromString } from "./timestamp-utils";

export interface SRTLineSegment {
  text: string;
  startTime: TimeStamp;
  endTime: TimeStamp;
}

export function getSRTFileFromVideoName(videoName: string) {
  const srtFile = `${pathToProcessDir}/output/${videoName}.srt`;
  return srtFile;
}

/**
 * @param videoId video.mp4
 * @returns the transcribed lines of the SRT file.
 */
export function getSRTFromVideo(videoId: VideoID): SRTLineSegment[] {
  const srtFile = getSRTFileFromVideoName(videoId);
  console.log(srtFile);
  const file = fs.readFileSync(srtFile).toString();
  const lines = file.split("\n");
  const segments: SRTLineSegment[] = [];
  const regex = /^\d+$/;
  lines.forEach((line: string, i: number) => {
    if (regex.test(line)) {
      const time = lines[i + 1];
      const text = lines[i + 2];
      let [startTime, endTime] = time.split(" --> ");
      segments.push({
        text,
        startTime: timeStampFromString(startTime),
        endTime: timeStampFromString(endTime),
      });
    }
  });

  return segments;
}
