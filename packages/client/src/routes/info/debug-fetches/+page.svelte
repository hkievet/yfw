<script>
	import { videos } from '$lib/stores/videos';
	import { transcripts } from '$lib/stores/transcripts';
	import { trimmedVideos } from '$lib/stores/trimmedVideos';
	import { videoStore } from '$lib/stores/aggregateVideo';
	console.log($videoStore);
</script>

{#if $videos !== null}
	<h1>Videos</h1>
	<ul>
		{#each $videos as video}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<li
				on:click={() => {
					// selectedVideo.set(`${video}`);
				}}
			>
				{video}
			</li>
		{/each}
	</ul>
{/if}

{#if $transcripts !== null}
	<h1>Transcripts</h1>
	<ul>
		{#each $transcripts as transcript}
			<li>{transcript}</li>
		{/each}
	</ul>
{/if}

{#if $trimmedVideos !== null}
	<h1>Trimmed</h1>
	<ul>
		{#each $trimmedVideos as trimmedVideo}
			<li
				on:click={() => {
					// selectedVideo.set(
					// 	`http://localhost:3333/static/trimmed/${encodeURIComponent(trimmedVideo)}`
					// );
				}}
			>
				{trimmedVideo}
			</li>
		{/each}
	</ul>
{/if}
