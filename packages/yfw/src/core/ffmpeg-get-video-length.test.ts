import { ffmpegGetVideoLength } from "./ffmpeg-get-video-length";

fdescribe("ffmpeg-get-video-length", () => {
  it("should accurately get the duration of a file", async () => {
    try {
      const duration = await ffmpegGetVideoLength(
        "/Users/hkievet/Coding/yfw-pipeline/process/videos/AoneminuteTEDxTalkforthedigitalageWoodyRoselandTEDxMileHigh.mp4"
      );
      expect(duration).toBe(807590);
    } catch (e) {
      console.log(e);
    }
  });
});
