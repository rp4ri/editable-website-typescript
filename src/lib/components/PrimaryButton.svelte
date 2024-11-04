<script lang="ts">
	import BaseButton from '$lib/components/BaseButton.svelte';
	export let type: 'button' | 'submit' | 'reset' | null = 'button';
	export let size = undefined;
	export let href = undefined;
</script>

<BaseButton
	{type}
	{size}
	{href}
	styles="font-medium hover:bg-gray-800 focus:ring-gray-900 border-2 border-transparent bg-gray-900 text-white"
	on:click
>
	<slot />
</BaseButton>
