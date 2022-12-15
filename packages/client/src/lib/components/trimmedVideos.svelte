<script lang="ts">
	import { selectedVideo } from '$lib/selectedVideo';
	import { clipSequence } from '$lib/stores/clipSequence';
	import { trimmedVideos } from '$lib/stores/trimmedVideos';
	import Video from '$lib/video.svelte';

	let selectedTrimmedVideo: string = '';
</script>

{#if $selectedVideo !== null && $selectedVideo?.trimmedUrls?.length}
	<h1>Trimmed</h1>
	<ul>
		{#each $selectedVideo.trimmedUrls as trimmedVideo}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<li
				on:click={() => {
					clipSequence.update((old) => {
						const newSequence = [...old];
						newSequence.push(trimmedVideo);
						return newSequence;
					});
				}}
			>
				{trimmedVideo}
			</li>
		{/each}
	</ul>
	<Video videoUrl={selectedTrimmedVideo} />
{/if}
