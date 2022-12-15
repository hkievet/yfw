import { writable } from 'svelte/store';

export interface TranscriptSelection {
	start: number;
	end: number;
}

export const transcriptLineSelection = writable<TranscriptSelection | null>(null);
