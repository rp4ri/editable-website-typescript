<script lang="ts">
	import { isEditing } from '$lib/stores';

	interface Props {
		src: string;
		alt: string;
		uploadPrompt?: any;
		maxWidth: number;
		maxHeight: number;
		quality: number;
		class?: string;
	}

	let {
		src = $bindable(),
		alt,
		uploadPrompt = undefined,
		maxWidth,
		maxHeight,
		quality,
		class: className = ''
	}: Props = $props();
	let previewSrc: string | undefined;
</script>

{#if $isEditing}
	{#await import('./ImageEditor.svelte')}
		<img class={className} src={previewSrc || src} {alt} />
	{:then ImageEditor}
		<ImageEditor.default
			class={className}
			bind:src
			{alt}
			{uploadPrompt}
			{maxWidth}
			{maxHeight}
			{quality}
		/>
	{/await}
{:else}
	<img width={maxWidth} height={maxHeight} class={className} {src} {alt} />
{/if}
