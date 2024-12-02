<script lang="ts">
	import { classNames } from '$lib/utils';
	import Modal from '$lib/components/Modal.svelte';
	import NotEditable from '$lib/components/NotEditable.svelte';
	import Search from '$lib/components/Search.svelte';
	import { isEditing, currentUser } from '$lib/stores';

	interface Props {
		// TODO: Replace with a globally managed context menu implementation (only one active)
		showUserMenu?: boolean | undefined;
		showSearch?: boolean | undefined;
	}

	let { showUserMenu = $bindable(undefined), showSearch = $bindable(undefined) }: Props = $props();

	function onKeyDown(e: KeyboardEvent): void {
		// Close modals
		if (e.key === 'Escape') {
			showSearch = false;
			showUserMenu = false;
		}
		// Trigger the search panel
		if (e.key === 'k' && e.metaKey) {
			showSearch = true;
		}
		// Turn on editing
		if (e.key === 'e' && e.metaKey) {
			$isEditing = true;
			console.log('Editing enabled');
		}
	}
</script>

{#if showSearch}
	<Modal position="top" on:close={() => (showSearch = false)}>
		<Search bind:showSearch />
	</Modal>
{/if}

<div
	class={classNames(
		'z-10 bg-white bg-opacity-95 text-sm backdrop-blur-sm transition-colors duration-500',
		!$isEditing ? 'sticky top-0' : ''
	)}
>
	<div class="mx-auto max-w-xs py-4">
		<NotEditable>
			<div class="relative flex items-center">
				<div class="flex-1"></div>
				<button
					title="Search"
					class={classNames('mr-6 hover:text-black')}
					onclick={() => (showSearch = true)}
					aria-label="Search"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-6 w-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
						/>
					</svg>
				</button>
				<a class="mr-4 rounded-md px-2 py-1 font-medium hover:text-black" href="/"> About </a>
				<a class="mr-4 rounded-md px-2 py-1 font-medium hover:text-black" href="/blog"> Blog </a>
				<a class="mr-4 rounded-md px-2 py-1 font-medium hover:text-black" href="/#contact">
					Contact
				</a>
				<div class="flex-1"></div>
				{#if $currentUser}
					<button
						onclick={() => (showUserMenu = !showUserMenu)}
						class="ml-0 hover:text-black"
						title={$currentUser.name}
						aria-label="User menu"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="h-6 w-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
							/>
						</svg>
					</button>
				{/if}
				<div class="flex-1"></div>
			</div>
		</NotEditable>
	</div>
</div>

<svelte:window onkeydown={onKeyDown} />
