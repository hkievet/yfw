<script>
	import { getTranscriptByUrl } from '$lib/stores/transcripts';
	import { selectedVideo } from '$lib/store';

	$: transcriptLines = getTranscriptByUrl($selectedVideo?.videoUrl);
</script>

{#await transcriptLines then lines}
	{#if lines}
		<h2>{$selectedVideo?.transcriptUrl}</h2>
		{#each lines as line, i}
			<p>{i + 1}. {line.text}</p>
		{/each}
	{:else}
		<p>Select a video.</p>
	{/if}
{/await}
