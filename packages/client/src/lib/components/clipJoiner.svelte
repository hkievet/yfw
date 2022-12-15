<script lang="ts">
	import { joinClips } from '$lib/actions';
	import { makeAggregateUrl, makeTrimmedUrl } from '$lib/makeMp4Url';
	import { clipSequence } from '$lib/stores/clipSequence';
	import Video from '$lib/video.svelte';
	let outputName = '';
	let aggregateVideoUrl = '';
</script>

<form
	on:submit={async () => {
		aggregateVideoUrl = await joinClips($clipSequence, outputName);
	}}
>
	<ul>
		{#each $clipSequence as clip, i}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<li
				on:click={() =>
					clipSequence.update((old) => {
						const newClipSequence = [...old];
						newClipSequence.splice(i, 1);
						return newClipSequence;
					})}
			>
				{clip}
			</li>
		{/each}
	</ul>
	<label>OutputName</label>
	<input bind:value={outputName} />
	<button type="submit">Join Clips</button>
</form>

{#if aggregateVideoUrl}
	<Video videoUrl={makeAggregateUrl(aggregateVideoUrl)} />
{/if}
