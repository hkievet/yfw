<script lang="ts">
	import PosterSVG from '$lib/poster.svg';
	import Transcripts from '$lib/transcripts.svelte';
	import VideoSelector from '$lib/components/videoSelector.svelte';
	import VideoTrimmer from '$lib/components/videoTrimmer.svelte';
	import TrimmedVideos from '$lib/components/trimmedVideos.svelte';
	import VideoDownloader from '$lib/components/videoDownloader.svelte';
	import ClipJoiner from '$lib/components/clipJoiner.svelte';
	import { selectedVideo } from '$lib/selectedVideo';
	import { H11YButton } from 'h11y-slc';
</script>

<div class="flex flex-row gap-x-2">
	<H11YButton />
	<div>
		<img src={PosterSVG} class="m-5" />
		<VideoSelector />
		<VideoDownloader />
	</div>
	<div>
		<!-- <p>${$selectedVideoUrl}</p> -->
		{#key $selectedVideo?.videoUrl}
			<Transcripts />
		{/key}
	</div>
	<div>
		{#key $selectedVideo?.videoUrl}
			<VideoTrimmer />
			<TrimmedVideos />
			<ClipJoiner />
		{/key}
	</div>
</div>
