// these are videos that are currently downloading

import { writable } from 'svelte/store';

export const currentlyDownloading = writable<string[]>([]);
