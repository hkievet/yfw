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

export async function getTranscripts() {
	try {
		const response = await fetch('http://localhost:3333/transcripts');
		const data = await response.json();
		transcripts.set(data);
		return data;
	} catch (e) {
		console.error(e);
	}
}

export async function getTrimmedVideos() {
	try {
		const response = await fetch('http://localhost:3333/trimmed');
		const data = await response.json();
		console.log(data);
		trimmedVideos.set(data);
		return data;
	} catch (e) {
		console.error(e);
	}
}

export const videos = writable<null | string[]>(null);
export const transcripts = writable<null | string[]>(null);
export const trimmedVideos = writable<null | string[]>(null);
