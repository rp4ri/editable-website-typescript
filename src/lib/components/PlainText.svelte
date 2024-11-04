<script lang="ts">
	import { isEditing } from '$lib/stores';

	export let content: string;
	export let multiLine = false;
</script>

{#if $isEditing}
	{#await import('./PlainTextEditor.svelte')}
		<!-- eslint-disable svelte/no-at-html-tags -->
		{@html content}
	{:then PlainTextEditor}
		<PlainTextEditor.default {multiLine} bind:content />
	{/await}
{:else}
	<!-- eslint-disable svelte/no-at-html-tags -->
	{@html content}
{/if}
