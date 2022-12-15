import { writable } from 'svelte/store';
import type { VideoData } from './stores/aggregateVideo';

// Sloppy way of piecing together all fo the data.
export const selectedVideo = writable<null | VideoData>(null);

// export const selectedVideoInfo: Readable<VideoData | null> = derived(
// 	[videoStore, selectedVideo],
// 	([$videoStore, $selectedVideoUrl], set) => {
// 		console.log($selectedVideoUrl);
// 		console.log($videoStore);
// 		if ($selectedVideoUrl && $videoStore) {
// 			const matchingVideo = $videoStore.find((v) => {
// 				v.videoUrl === $selectedVideoUrl;
// 			});
// 			if (matchingVideo) {
// 				set(matchingVideo);
// 			}
// 		}
// 	}
// );
