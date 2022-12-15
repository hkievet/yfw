<script lang="ts">
	import Video from '$lib/video.svelte';
	import { selectedVideo } from '$lib/store';

	let urlInput: string = '';

	async function postUrl() {
		console.log(urlInput);

		try {
			const response = await fetch('http://localhost:3333/start', {
				body: JSON.stringify({
					url: urlInput
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

	import { onMount } from 'svelte';
	import Transcripts from '$lib/transcripts.svelte';
	import { getVideos } from '$lib/stores/videos';
	import { getTranscripts } from '$lib/stores/transcripts';
	import { getTrimmedVideos } from '$lib/stores/trimmedVideos';
	import { videoStore } from '$lib/stores/aggregateVideo';
	import VideoSelector from '$lib/components/videoSelector.svelte';
	import VideoTrimmer from '$lib/components/videoTrimmer.svelte';
	console.log($videoStore);

	onMount(() => {
		getVideos();
		getTranscripts();
		getTrimmedVideos();
	});
</script>

<div class="flex flex-row">
	<div>
		<VideoSelector />

		<div class="rounded-sm border-solid border-2 border-h11y-black">
			<form on:submit={postUrl}>
				<input bind:value={urlInput} class="rounded-sm border-solid border-2 border-h11y-black" />
				<button type="submit">Process URL</button>
			</form>
		</div>
	</div>
	<div>
		<!-- <p>${$selectedVideoUrl}</p> -->
		<Transcripts />
	</div>
	<div>
		<VideoTrimmer />
	</div>
</div>
