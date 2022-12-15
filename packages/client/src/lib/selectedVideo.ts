import { writable } from 'svelte/store';
import type { VideoData } from './stores/aggregateVideo';

// Sloppy way of piecing together all fo the data.
export const selectedVideo = writable<null | VideoData>(null);
