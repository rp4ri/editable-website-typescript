<script lang="ts">
	import { classNames } from '$lib/utils';
	import { wrapInList } from 'prosemirror-schema-list';

	import type { EditorView } from 'prosemirror-view';
	import type { EditorState } from 'prosemirror-state';

	interface Props {
		editorView: EditorView;
		editorState: EditorState;
		children?: import('svelte').Snippet;
	}

	let { editorView, editorState, children }: Props = $props();

	let schema = $derived(editorState.schema);
	let disabled = $derived(!wrapInList(schema.nodes.bullet_list)(editorView.state));

	function handleClick() {
		wrapInList(schema.nodes.bullet_list)(editorState, editorView.dispatch);
		editorView.focus();
	}
</script>

<button
	onclick={handleClick}
	{disabled}
	class={classNames('rounded-full p-2 hover:bg-gray-100 disabled:opacity-30 sm:mx-1')}
>
	{@render children?.()}
</button>
