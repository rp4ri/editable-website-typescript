<script lang="ts">
	import { toggleMark } from 'prosemirror-commands';
	import { markActive } from '$lib/editor/prosemirrorUtil';
	import { classNames } from '$lib/utils';

	import type { EditorView } from 'prosemirror-view';
	import type { EditorState } from 'prosemirror-state';

	interface Props {
		editorView: EditorView;
		editorState: EditorState;
		type: any;
		children?: import('svelte').Snippet;
	}

	let { editorView, editorState, type, children }: Props = $props();

	let schema = $derived(editorState.schema);
	let markType = $derived(schema.marks[type]);

	let command = $derived(toggleMark(markType));
	let disabled = $derived(!markType || !command(editorState, undefined));
	let active = $derived(markActive(markType)(editorState));

	function handleClick() {
		command(editorState, editorView.dispatch, editorView);
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
