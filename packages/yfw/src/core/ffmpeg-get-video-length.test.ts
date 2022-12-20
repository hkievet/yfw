import { ffmpegGetVideoLength } from "./ffmpeg-get-video-length";

describe("ffmpeg-get-video-length", () => {
  it("should accurately get the duration of a file", () => {
    const duration = ffmpegGetVideoLength();
  });
});
