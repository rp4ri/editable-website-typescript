<script lang="ts">
	import { classNames } from '$lib/utils';
	import { setBlockType } from 'prosemirror-commands';
	import { blockTypeActive } from '$lib/editor/prosemirrorUtil';

	import type { EditorView } from 'prosemirror-view';
	import type { EditorState } from 'prosemirror-state';

	interface Props {
		editorView: EditorView;
		editorState: EditorState;
		children?: import('svelte').Snippet;
	}

	let { editorView, editorState, children }: Props = $props();

	let schema = $derived(editorState.schema);
	let disabled = $derived(
		!setBlockType(schema.nodes.heading)(editorState) &&
			!setBlockType(schema.nodes.paragraph)(editorState)
	);
	let active = $derived(blockTypeActive(schema.nodes.heading, { level: 1 })(editorState));

	function handleClick() {
		if (active) {
			setBlockType(schema.nodes.paragraph)(editorState, editorView.dispatch);
		} else {
			setBlockType(schema.nodes.heading, { level: 1 })(editorState, editorView.dispatch);
		}
		editorView.focus();
	}
</script>

<button
	onclick={handleClick}
	{disabled}
	class={classNames(
		active ? 'bg-gray-900 text-white' : 'hover:bg-gray-100',
		'rounded-full p-2 disabled:opacity-30 sm:mx-1'
	)}
>
	{@render children?.()}
</button>
