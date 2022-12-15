<script>
	import { getTranscriptByUrl } from '$lib/stores/transcripts';
	import { selectedVideo } from '$lib/store';

	$: transcriptLines = getTranscriptByUrl($selectedVideo?.videoUrl);
</script>

<p>{$selectedVideo?.transcriptUrl}</p>

{#await transcriptLines then lines}
	{#if lines}
		{#each lines as line, i}
			<p>{i}. {line.text}</p>
		{/each}
	{/if}
{/await}
