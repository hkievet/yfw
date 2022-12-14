<script lang="ts">
	import Video from '$lib/video.svelte';
	import { selectedVideoUrl } from '$lib/store';
	let urlInput: string = '';

	async function postUrl() {
		console.log(urlInput);

		try {
			const response = await fetch('http://localhost:3333/start', {
				body: JSON.stringify({
					url: urlInput
				}),
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				method: 'POST'
			});
		} catch (e) {
			console.error(e);
		}
	}

	import { onMount } from 'svelte';
	import {
		getVideos,
		videos,
		getTranscripts,
		transcripts,
		trimmedVideos,
		getTrimmedVideos
	} from '$lib/store';

	onMount(() => {
		getVideos();
		getTranscripts();
		getTrimmedVideos();
	});
</script>

{#if $videos !== null}
	<h1>Videos</h1>
	<ul>
		{#each $videos as video}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<li
				on:click={() => {
					selectedVideoUrl.set(`http://localhost:3333/static/videos/${video}`);
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
					selectedVideoUrl.set(
						`http://localhost:3333/static/trimmed/${encodeURIComponent(trimmedVideo)}`
					);
				}}
			>
				{trimmedVideo}
			</li>
		{/each}
	</ul>
{/if}

<Video />

<form on:submit={postUrl}>
	<input bind:value={urlInput} />
	<button type="submit">Submit</button>
</form>
