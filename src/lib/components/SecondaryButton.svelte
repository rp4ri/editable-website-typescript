<script lang="ts">
	import BaseButton from '$lib/components/BaseButton.svelte';
	export let type: 'button' | 'submit' | 'reset' | null = 'button';
	export let size = undefined;
	export let href = undefined;
</script>

<BaseButton
	{href}
	{type}
	{size}
	styles="font-medium hover:bg-gray-100 focus:ring-gray-100 border-2 border-gray-100 bg-white"
	on:click
>
	<slot />
</BaseButton>
