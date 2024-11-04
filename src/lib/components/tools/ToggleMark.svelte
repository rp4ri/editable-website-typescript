<script lang="ts">
	import { toggleMark } from 'prosemirror-commands';
	import { markActive } from '$lib/editor/prosemirrorUtil';
	import { classNames } from '$lib/utils';

	import type { EditorView } from 'prosemirror-view';
	import type { EditorState } from 'prosemirror-state';

	export let editorView: EditorView;
	export let editorState: EditorState;
	export let type;

	$: schema = editorState.schema;
	$: markType = schema.marks[type];

	$: command = toggleMark(markType);
	$: disabled = !markType || !command(editorState, undefined);
	$: active = markActive(markType)(editorState);

	function handleClick() {
		command(editorState, editorView.dispatch, editorView);
		editorView.focus();
	}
</script>

<button
	on:click={handleClick}
	{disabled}
	class={classNames(
		active ? 'bg-gray-900 text-white' : 'hover:bg-gray-100',
		'rounded-full p-2 disabled:opacity-30 sm:mx-1'
	)}
>
	<slot />
</button>
