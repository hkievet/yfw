<script lang="ts">
	import { postUrl } from '$lib/actions';
	let urlInput: string = '';
</script>

<div class="rounded-sm border-solid border-2 border-h11y-black">
	<form on:submit={() => postUrl(urlInput)}>
		<input bind:value={urlInput} class="rounded-sm border-solid border-2 border-h11y-black" />
		<button type="submit">Process URL</button>
	</form>
</div>
