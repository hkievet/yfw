import { getSRTFromVideo, SRTLineSegment } from "./get-srt-from-video";

/**
 * Gets the start and end timestamps and the text within for a given video
 *
 * @param videoId
 * @param start
 * @param end
 * @returns
 */
export function getIntervalFromSRT(
  videoId: VideoID,
  start: number,
  end: number
): SRTLineSegment {
  const segments = getSRTFromVideo(videoId);
  // should be figured out and calculatable..
  const requestedSegments = segments.slice(start - 1, end);
  const combinedText = requestedSegments
    .map((segment) => segment.text)
    .join(" ");

  // start 1 second earlier and end 1 second earlier.
  // 00:03:31 these are shaped like this:
  let startTime = requestedSegments[0].startTime;
  //   let [hhmmss, ms] = startTime.split(",");
  //   let [hh, mm, ss] = hhmmss.split(":");
  //   ss = String(Number.parseInt(ss) - 1).padStart(2, "0");
  //   startTime = `${[hh, mm, ss].join(":")}.${ms}`;

  let endTime = requestedSegments[requestedSegments.length - 1].endTime;
  //   [hhmmss, ms] = endTime.split(",");
  //   [hh, mm, ss] = endTime.split(":");
  //   ss = String(Number.parseInt(ss) + 1).padStart(2, "0");
  //   endTime = `${[hh, mm, ss].join(":")}.${ms}`;

  //   console.log(startTime, " - ", endTime);

  return {
    startTime,
    endTime,
    text: combinedText,
  };
}
