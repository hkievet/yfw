export async function getVideos() {
	const response = await fetch('localhost:3333/videos');
	const data = await response.json();
	console.log(data);
	return data;
}
