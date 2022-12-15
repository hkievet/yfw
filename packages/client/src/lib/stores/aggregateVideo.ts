import { derived, type Readable } from 'svelte/store';
import { transcripts } from './transcripts';
import { trimmedVideos } from './trimmedVideos';
import { videos } from './videos';

export interface VideoData {
	videoUrl: string;
	trimmedUrls: string[] | null;
	transcriptUrl: string | null;
}
export const videoStore: Readable<VideoData[]> = derived(
	[trimmedVideos, transcripts, videos],
	([$trimmed, $transcripts, $videos], set) => {
		if ($videos) {
			const videoData = $videos.map((video: string) => {
				const videoObject: VideoData = {
					videoUrl: video,
					trimmedUrls: null,
					transcriptUrl: null
				};
				const matchingTranscript = $transcripts?.find((t) => {
					return t.includes(video);
				});
				if (matchingTranscript) {
					videoObject.transcriptUrl = matchingTranscript;
				}

				const trimmedVideos = $trimmed?.filter((t) => {
					return t.includes(video);
				});
				if (trimmedVideos) {
					videoObject.trimmedUrls = trimmedVideos;
				}
				return videoObject;
			});
			set(videoData);
		} else {
			set([]);
		}
	}
);
