<script lang="ts">
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
	{#each $videos as video}
		<ul>
			<li>{video}</li>
		</ul>
	{/each}
{/if}

{#if $transcripts !== null}
	<h1>Transcripts</h1>
	{#each $transcripts as transcript}
		<ul>
			<li>{transcript}</li>
		</ul>
	{/each}
{/if}

{#if $trimmedVideos !== null}
	<h1>Trimmed</h1>
	{#each $trimmedVideos as trimmedVideo}
		<ul>
			<li>{trimmedVideo}</li>
		</ul>
	{/each}
{/if}

<form on:submit={postUrl}>
	<input bind:value={urlInput} />
	<button type="submit">Submit</button>
</form>
