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
	{type}
	{size}
	{href}
	styles="font-medium hover:bg-gray-800 focus:ring-gray-900 border-2 border-transparent bg-gray-900 text-white"
	on:click
>
	{@render children?.()}
</BaseButton>
