<script lang="ts">
	import Transcripts from '$lib/transcripts.svelte';
	import VideoSelector from '$lib/components/videoSelector.svelte';
	import VideoTrimmer from '$lib/components/videoTrimmer.svelte';
	import TrimmedVideos from '$lib/components/trimmedVideos.svelte';
	import VideoDownloader from '$lib/components/videoDownloader.svelte';
	import ClipJoiner from '$lib/components/clipJoiner.svelte';
</script>

<div class="flex flex-row gap-x-2">
	<div>
		<VideoSelector />
		<VideoDownloader />
	</div>
	<div>
		<!-- <p>${$selectedVideoUrl}</p> -->
		<Transcripts />
	</div>
	<div>
		<VideoTrimmer />
		<TrimmedVideos />
		<ClipJoiner />
	</div>
</div>
