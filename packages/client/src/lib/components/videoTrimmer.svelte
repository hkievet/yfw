<script lang="ts">
	import { trimVideo } from '$lib/actions';
	import { selectedVideo } from '$lib/store';
	import Video from '$lib/video.svelte';

	let start: string = '';
	let end: string = '';

	let outputUrl: string;

	async function _trimVideo() {
		let startIndex = Number.parseInt(start);
		let endIndex = Number.parseInt(end);
		console.log(startIndex, endIndex);
		if (!isNaN(startIndex) && !isNaN(endIndex) && $selectedVideo?.videoUrl) {
			outputUrl = await trimVideo($selectedVideo?.videoUrl, startIndex, endIndex);
		}
	}
</script>

<form on:submit={_trimVideo}>
	<label>Video</label>
	<p>{$selectedVideo?.videoUrl}</p>
	<label>Start</label>
	<input bind:value={start} />
	<label>End</label>
	<input bind:value={end} />
	<button type="submit">Create trimmed Video</button>
</form>

{#if outputUrl}
	<Video videoUrl={outputUrl} />
{/if}
