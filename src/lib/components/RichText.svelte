<script lang="ts">
	import { isEditing } from '$lib/stores';

	interface Props {
		content: string;
		multiLine?: boolean;
	}

	let { content = $bindable(), multiLine = false }: Props = $props();
</script>

{#if $isEditing}
	{#await import('./RichTextEditor.svelte')}
		<!-- eslint-disable svelte/no-at-html-tags -->
		{@html content}
	{:then RichTextEditor}
		<RichTextEditor.default {multiLine} bind:content />
	{/await}
{:else}
	<div>
		<!-- eslint-disable svelte/no-at-html-tags -->
		{@html content}
	</div>
{/if}
