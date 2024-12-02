<script lang="ts">
	import { isEditing } from '$lib/stores';

	interface Props {
		content: string;
		multiLine?: boolean;
	}

	let { content = $bindable(), multiLine = false }: Props = $props();
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
