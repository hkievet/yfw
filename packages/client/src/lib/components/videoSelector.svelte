<script lang="ts">
	import { makeVideoUrl } from '$lib/makeMp4Url';
	import { selectedVideo } from '$lib/selectedVideo';
	import { videoStore } from '$lib/stores/aggregateVideo';
	import Video from '$lib/video.svelte';
</script>

{#if $videoStore !== null}
	<h1>Videos</h1>
	<ul>
		{#each $videoStore as video}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<li
				class="hover:cursor-pointer hover:bg-h11ywhite"
				class:selected={$selectedVideo?.videoUrl === video.videoUrl}
				on:click={() => {
					selectedVideo.set(video);
				}}
			>
				{video.videoUrl}
			</li>
		{/each}
	</ul>
{/if}

{#if selectedVideo && $selectedVideo?.videoUrl}
	<Video videoUrl={makeVideoUrl($selectedVideo.videoUrl)} />
{/if}

<style lang="postcss">
	li.selected {
		@apply font-bold;
	}
</style>
