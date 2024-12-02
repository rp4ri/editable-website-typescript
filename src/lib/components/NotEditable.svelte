<script lang="ts">
	import { classNames } from '$lib/utils';
	import { isEditing } from '$lib/stores';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class={classNames($isEditing ? 'relative cursor-not-allowed opacity-25' : '')}>
	{#if $isEditing}
		<div class="absolute inset-0 z-50"></div>
	{/if}
	{@render children?.()}
</div>
