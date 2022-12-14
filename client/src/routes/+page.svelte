<script>
	import { onMount } from 'svelte';
	import { getVideos } from '$lib/store.ts';

	onMount(() => {
		getVideos();
	});
</script>
