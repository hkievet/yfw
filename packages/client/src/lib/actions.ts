import { makeTrimmedUrl } from './makeMp4Url';

export async function postUrl(url: string) {
	try {
		const response = await fetch('http://localhost:3333/start', {
			body: JSON.stringify({
				url
			}),
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST'
		});
	} catch (e) {
		console.error(e);
		throw e;
	}
}

export async function trimVideo(url: string, start: number, end: number): Promise<string> {
	try {
		const response = await fetch('http://localhost:3333/trimVideo', {
			body: JSON.stringify({
				url,
				start,
				end
			}),
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST'
		});
		const data = await response.json();
		return makeTrimmedUrl(data.trimUrl);
	} catch (e) {
		console.error(e);
		throw e;
	}
}

export async function joinClips(videoIds: string[], outputName: string): Promise<string> {
	if (outputName && videoIds.length) {
		try {
			const response = await fetch('http://localhost:3333/joinClips', {
				body: JSON.stringify({
					clips: videoIds,
					name: outputName
				}),
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				method: 'POST'
			});
			const data = await response.json();
			return data.aggregateUrl;
		} catch (e) {
			console.error(e);
			throw e;
		}
	}
	return '';
}
