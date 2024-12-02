<script lang="ts">
	import { classNames } from '$lib/utils';
	interface Props {
		noPadding?: boolean;
		children?: import('svelte').Snippet;
	}

	let { noPadding = false, children }: Props = $props();
</script>

<div class={classNames('mx-auto max-w-lg', noPadding ? '' : 'px-4')}>
	{@render children?.()}
</div>
