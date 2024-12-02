<script lang="ts">
	import WebsiteNav from '$lib/components/WebsiteNav.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import EditorToolbar from '$lib/components/tools/EditorToolbar.svelte';
	import { createEventDispatcher } from 'svelte';

	interface Props {
		showUserMenu?: boolean;
		children?: import('svelte').Snippet;
	}

	let { showUserMenu = $bindable(false), children }: Props = $props();
	const dispatch = createEventDispatcher<{ cancel: void; save: void }>();
</script>

<EditorToolbar on:cancel={() => dispatch('cancel')} on:save={() => dispatch('save')} />
<WebsiteNav bind:showUserMenu />
{#if showUserMenu}
	<Modal on:close={() => (showUserMenu = false)}>
		<div class="flex w-full flex-col space-y-4 p-4 sm:p-6">
			{@render children?.()}
		</div>
	</Modal>
{/if}
