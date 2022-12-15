import command from "commander";
import path from "path";
import { pathToProcessDir } from "./constants";
import { downloadYoutubeVideo } from "./download-youtube-video";
import { ffmpegMakeClip } from "./ffmpeg-make-clip";
import { getIntervalFromSRT } from "./get-interval-from-srt";
import { getVideoTitle } from "./get-video-title";
import { runWhisperOnFile } from "./run-whisper-on-file";

/**
 * Produces a new clip in process/trimmed
 *
 * @param video the title of the video in process/videos (ending in .mp4)
 * @param start the index of the SRT file (1-based) that you want to start the clip at
 * @param end the index of the SRT file (1-based) that you want to end the clip at
 * @returns
 */
export async function trimVideo(
  video: VideoID,
  start: number,
  end: number
): Promise<string> {
  const { startTime, endTime, text } = getIntervalFromSRT(video, start, end);
  // add
  return await ffmpegMakeClip(video, startTime, endTime, text);
}

export async function startFullProcess(url: string) {
  try {
    const title = await getVideoTitle(url);
    const fp = await downloadYoutubeVideo(url, title);
    const finished = await runWhisperOnFile(fp);
  } catch (e) {
    console.error(e);
  }
}
