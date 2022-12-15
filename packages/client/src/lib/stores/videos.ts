import { writable } from 'svelte/store';

export async function getVideos() {
	try {
		const response = await fetch('http://localhost:3333/videos');
		const data = await response.json();
		console.log(data);
		videos.set(data);
		return data;
	} catch (e) {
		console.error(e);
	}
}

export const videos = writable<null | string[]>(null);
