<script lang="ts">
	import { makeTrimmedUrl } from '$lib/makeMp4Url';
	import { selectedVideo } from '$lib/store';
	import Video from '$lib/video.svelte';

	let selectedTrimmedVideo: string = '';
</script>

{#if $selectedVideo !== null && $selectedVideo?.trimmedUrls?.length}
	<h1>Trimmed</h1>
	<ul>
		{#each $selectedVideo.trimmedUrls as trimmedVideo}
			<li
				on:click={() => {
					selectedTrimmedVideo = makeTrimmedUrl(trimmedVideo);
				}}
			>
				{trimmedVideo}
			</li>
		{/each}
	</ul>
	<Video videoUrl={selectedTrimmedVideo} />
{/if}
