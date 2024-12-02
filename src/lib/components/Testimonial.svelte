<script lang="ts">
	import PlainText from './PlainText.svelte';
	import { classNames } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';
	import { isEditing } from '$lib/stores';
	import Image from '$lib/components/image-editor/Image.svelte';

	import * as Avatar from '$lib/components/ui/avatar';

	const dispatch = createEventDispatcher();

	interface Props {
		testimonial: any;
		firstEntry?: boolean;
		lastEntry?: boolean;
	}

	let { testimonial = $bindable(), firstEntry = false, lastEntry = false }: Props = $props();
</script>

<div class={classNames(firstEntry ? 'pb-8 pt-2 sm:pb-12' : 'py-8 sm:py-12')}>
	<div class="relative mx-auto flex max-w-screen-md space-x-6 px-6 sm:space-x-8">
		<div class="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full sm:h-20 sm:w-20">
			<Image
				class="rounded-full"
				maxWidth={160}
				maxHeight={160}
				quality={0.8}
				bind:src={testimonial.image}
				alt={testimonial.name}
			/>
		</div>
		<div class="flex-1">
			<div class="text-lg italic sm:text-2xl">
				<PlainText bind:content={testimonial.text} />
			</div>
			<div class="mt-4 font-medium md:text-xl">
				<PlainText bind:content={testimonial.name} />
			</div>
		</div>
		{#if $isEditing}
			<div class="flex flex-col space-y-2">
				<button
					class="h-6 w-6 rounded-full bg-gray-900 p-1 text-white hover:bg-gray-800"
					onclick={() => dispatch('delete')}
					aria-label="Delete"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-4 w-4"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
				<button
					class={classNames(
						'h-6 w-6 rounded-full p-1 hover:bg-gray-100',
						firstEntry ? 'opacity-20' : ''
					)}
					onclick={() => dispatch('up')}
					aria-label="Move up"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-4 w-4"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
					</svg>
				</button>
				<button
					class={classNames(
						'h-6 w-6 rounded-full p-1 hover:bg-gray-100',
						lastEntry ? 'opacity-20' : ''
					)}
					onclick={() => dispatch('down')}
					aria-label="Move down"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-4 w-4"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
					</svg>
				</button>
			</div>
		{/if}
	</div>
</div>
