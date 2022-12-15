import { writable } from 'svelte/store';

export async function getTrimmedVideos() {
	try {
		const response = await fetch('http://localhost:3333/trimmed');
		const data = await response.json();
		trimmedVideos.set(data);
	} catch (e) {
		console.error(e);
	}
}

export const trimmedVideos = writable<null | string[]>(null);
