<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { getVideos } from '$lib/stores/videos';
	import { getTranscripts } from '$lib/stores/transcripts';
	import { getTrimmedVideos } from '$lib/stores/trimmedVideos';
	onMount(() => {
		getVideos();
		getTranscripts();
		getTrimmedVideos();
	});
</script>

<slot />
