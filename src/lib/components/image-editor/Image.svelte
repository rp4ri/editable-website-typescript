<script lang="ts">
	import { isEditing } from '$lib/stores';

	export let src: string;
	export let alt: string;
	export let uploadPrompt = undefined;
	export let maxWidth: number;
	export let maxHeight: number;
	export let quality: number;
	let className = '';
	let previewSrc: string | undefined;
	export { className as class };
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
