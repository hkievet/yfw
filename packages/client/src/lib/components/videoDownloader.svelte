<script lang="ts">
	import { postUrl } from '$lib/actions';
	import { currentlyDownloading } from '$lib/stores/currentlyDownloading';
	let urlInput: string = '';
</script>

<div class="rounded-sm border-solid border-2 border-h11y-black">
	<form on:submit={() => postUrl(urlInput)}>
		<input bind:value={urlInput} class="rounded-sm border-solid border-2 border-h11y-black" />
		<button type="submit">Process URL</button>
	</form>

	{#if $currentlyDownloading.length}
		<p>Currently Downloading:</p>
		<ul>
			{#each $currentlyDownloading as url}
				<li>{url}</li>
			{/each}
		</ul>
	{/if}
</div>
