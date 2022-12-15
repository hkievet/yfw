<script lang="ts">
	export let videoUrl: string;
</script>

{#if videoUrl}
	{#key videoUrl}
		<p>{videoUrl}</p>
		<video width="320" height="240" controls>
			<source src={videoUrl} type="video/mp4" />
			Your browser does not support the video tag.
		</video>
	{/key}
{/if}
