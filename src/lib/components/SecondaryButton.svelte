<script lang="ts">
	import BaseButton from '$lib/components/BaseButton.svelte';
	interface Props {
		type?: 'button' | 'submit' | 'reset' | null;
		size?: 'sm' | 'lg' | undefined;
		href?: string | undefined;
		children?: import('svelte').Snippet;
	}

	let { type = 'button', size = undefined, href = undefined, children }: Props = $props();
</script>

<BaseButton
	{href}
	{type}
	{size}
	styles="font-medium hover:bg-gray-100 focus:ring-gray-100 border-2 border-gray-100 bg-white"
	on:click
>
	{@render children?.()}
</BaseButton>
