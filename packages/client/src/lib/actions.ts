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
	}
}

export async function trimVideo(url: string, start: number, end: number) {
	console.log('bam');
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
	}
}
