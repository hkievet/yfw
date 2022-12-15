<script>
	import { selectedVideo } from '$lib/store';
	import { videoStore } from '$lib/stores/aggregateVideo';
</script>

{#if $videoStore !== null}
	<h1>Videos</h1>
	<ul>
		{#each $videoStore as video}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<li
				on:click={() => {
					selectedVideo.set(video);
				}}
			>
				{video.videoUrl}
			</li>
		{/each}
	</ul>
{/if}
