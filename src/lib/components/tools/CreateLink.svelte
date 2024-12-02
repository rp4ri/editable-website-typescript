<script lang="ts">
	import { classNames } from '$lib/utils';
	import { toggleMark } from 'prosemirror-commands';
	import { createLink } from '$lib/editor/prosemirrorCommands';

	import type { EditorView } from 'prosemirror-view';
	import type { EditorState } from 'prosemirror-state';

	interface Props {
		editorView: EditorView;
		editorState: EditorState;
		children?: import('svelte').Snippet;
	}

	let { editorView, editorState, children }: Props = $props();

	let schema = $derived(editorState.schema);
	let disabled = $derived(!createLink(editorState));

	function handleClick() {
		let url = prompt('Enter link URL', 'https://example.com');
		if (url) {
			toggleMark(schema.marks.link, { href: url })(editorState, editorView.dispatch);
			editorView.focus();
		}
	}
</script>

<button
	onclick={handleClick}
	{disabled}
	class={classNames('rounded-full p-2 hover:bg-gray-100 disabled:opacity-30 sm:mx-1')}
>
	{@render children?.()}
</button>
