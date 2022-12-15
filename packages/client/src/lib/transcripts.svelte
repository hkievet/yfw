<script lang="ts">
	import { getTranscriptByUrl } from '$lib/stores/transcripts';
	import { selectedVideo } from '$lib/store';
	import { transcriptLineSelection } from './stores/transcriptLineSelection';

	type SelectionState = 'NONE' | 'SELECTING' | 'FINISHED';

	let anchor = -1;
	let end = -1;
	let selectionState: SelectionState = 'NONE';
	$: small = anchor < end ? anchor : end;
	$: big = anchor > end ? anchor : end;

	function startSelection(i: number) {
		selectionState = 'SELECTING';
		anchor = i;
		end = i;
	}

	function hover(i: number) {
		if (selectionState === 'SELECTING') {
			end = i;
		}
	}

	function endSelection(i: number) {
		selectionState = 'FINISHED';
		transcriptLineSelection.set({ start: small, end: big });
	}

	function isBetween(i: number, _anchor: number, _end: number) {
		if (selectionState === 'NONE' || _end === -1) {
			return false;
		}
		let small = _anchor < _end ? _anchor : _end;
		let big = _anchor > _end ? _anchor : _end;

		if (small <= i && i <= big) {
			return true;
		}
		return false;
	}

	function isStartSelection(i: number, _anchor: number, _end: number) {
		let small = _anchor < _end ? _anchor : _end;
		return i === small;
	}
	function isLastSelection(i: number, _anchor: number, _end: number) {
		const big = _anchor > _end ? _anchor : _end;
		return i === big;
	}

	$: transcriptLines = getTranscriptByUrl($selectedVideo?.videoUrl);
</script>

{#await transcriptLines then lines}
	{#if lines}
		<h2>{$selectedVideo?.transcriptUrl}</h2>
		<div class="transcript">
			{#each lines as line, i}
				<p
					on:mousedown={() => startSelection(i)}
					on:mouseenter={() => {
						hover(i);
					}}
					on:mouseup={() => endSelection(i)}
					class:selected={isBetween(i, anchor, end)}
					class:firstSelected={isStartSelection(i, anchor, end)}
					class:lastSelected={isLastSelection(i, anchor, end)}
					class="hover:bg-h11ywhite hover:cursor-pointer select-none p-2"
				>
					{i + 1}. {line.text}
				</p>
			{/each}
		</div>
	{:else}
		<p>Select a video.</p>
	{/if}
{/await}

<style lang="postcss">
	.selected {
		@apply bg-h11ypeach;
	}
	.firstSelected {
		@apply rounded-t-lg;
	}
	.lastSelected {
		@apply rounded-b-lg;
	}
</style>
