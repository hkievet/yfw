import type { SRTLineSegment } from '$lib/types';
import { writable } from 'svelte/store';

export const transcripts = writable<null | string[]>(null);

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

export async function getTranscriptByUrl(url?: string | null): Promise<SRTLineSegment[] | null> {
	console.log(url);
	if (!url) {
		return null;
	}
	try {
		const response = await fetch('http://localhost:3333/transcripts/' + url);
		const data = await response.json();
		return data;
	} catch (e) {
		console.error(e);
	}
	return null;
}
