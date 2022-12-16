<script lang="ts">
	import { trimVideo } from '$lib/actions';
	import { selectedVideo } from '$lib/selectedVideo';
	import { transcriptLineSelection } from '$lib/stores/transcriptLineSelection';
	import Video from '$lib/video.svelte';
	import { onMount } from 'svelte';

	let start: string = '';
	let end: string = '';

	let outputUrl: string;

	async function _trimVideo() {
		let startIndex = Number.parseInt(start);
		let endIndex = Number.parseInt(end);
		if (!isNaN(startIndex) && !isNaN(endIndex) && $selectedVideo?.videoUrl) {
			outputUrl = await trimVideo($selectedVideo?.videoUrl, startIndex, endIndex);
		}
	}

	onMount(() => {
		transcriptLineSelection.set(null);
		transcriptLineSelection.subscribe((v) => {
			if (v !== null) {
				start = (v.start + 1).toString();
				end = (v.end + 1).toString();
			}
		});
	});
</script>

{#if $selectedVideo}
	<form on:submit={_trimVideo}>
		<h3>Video Clipper</h3>
		<p>
			<label>Video</label>
			{$selectedVideo?.videoUrl}
		</p>
		<label>Start</label>
		<input bind:value={start} />
		<label>End</label>
		<input bind:value={end} />
		<button type="submit">Create trimmed Video</button>
	</form>
{/if}

{#if outputUrl}
	<Video videoUrl={outputUrl} />
{/if}

<style lang="postcss">
	label {
		@apply font-mono;
	}
</style>
