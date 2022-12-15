import {
  downloadedVideosPath,
  generatedTranscriptsPath,
  trimmedVideosPath,
} from "../constants";

export function getVideoFromId(videoId: VideoID): string {
  return downloadedVideosPath + "/" + videoId;
}

export function getTranscriptFromId(videoId: VideoID): string {
  return generatedTranscriptsPath + "/" + videoId + ".srt";
}

export function getTrimmedVideos(videoId: VideoID): string {
  return trimmedVideosPath + "/" + videoId;
}

export function getAggregateVideo(videoId: VideoID): string {
  return trimmedVideosPath + "/" + videoId;
}
