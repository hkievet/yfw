<script>
	import { selectedVideoUrl } from '$lib/store';
</script>

{#if $selectedVideoUrl}
	{#key $selectedVideoUrl}
		<p>{$selectedVideoUrl}</p>
		<video width="320" height="240" controls>
			<source src={$selectedVideoUrl} type="video/mp4" />
			Your browser does not support the video tag.
		</video>
	{/key}
{/if}
