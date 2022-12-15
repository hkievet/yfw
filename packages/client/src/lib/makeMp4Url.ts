export function makeTrimmedUrl(url: string): string {
	return `http://localhost:3333/static/trimmed/${encodeURIComponent(url)}`;
}

export function makeVideoUrl(url: string) {
	return `http://localhost:3333/static/videos/${encodeURIComponent(url)}`;
}

export function makeAggregateUrl(url: string) {
	return `http://localhost:3333/static/aggregate/${encodeURIComponent(url)}`;
}
