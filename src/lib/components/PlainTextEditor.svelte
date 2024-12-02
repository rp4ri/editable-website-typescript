<script lang="ts">
	import { run } from 'svelte/legacy';

	import { onMount, onDestroy } from 'svelte';
	import { toHTML, fromHTML } from '$lib/editor/prosemirrorUtil';
	import {
		singleLinePlainTextSchema,
		multiLinePlainTextSchema
	} from '$lib/editor/prosemirrorSchemas';
	import { activeEditorView } from '$lib/stores';
	import { EditorState, Plugin } from 'prosemirror-state';
	import { EditorView } from 'prosemirror-view';
	import { history } from 'prosemirror-history';
	import { keymap } from 'prosemirror-keymap';
	import { baseKeymap } from 'prosemirror-commands';
	import { buildKeymap } from '$lib/editor/prosemirrorKeymap';

	import type { Transaction } from 'prosemirror-state';

	interface Props {
		content?: string;
		multiLine?: boolean;
	}

	let { content = $bindable(''), multiLine = false }: Props = $props();

	let editorChange = $state(false);
	let prosemirrorNode: HTMLElement = $state();
	let editorView: EditorView | undefined = $state();
	let editorState: EditorState = $state();

	function dispatchTransaction(this: EditorView, transaction: Transaction) {
		const editorState = this.state.apply(transaction);
		this.updateState(editorState);
		if (transaction.docChanged) {
			content = toHTML(editorState);
			// Leave a hint so we know the last content update came
			// from the editor (not the parent)
			editorChange = true;
		}
		this.state = editorState;
	}

	const onUpdatePlugin = new Plugin({
		view() {
			return {
				update(updatedView) {
					activeEditorView.set(updatedView);
				}
			};
		}
	});

	onMount(() => {
		editorView = new EditorView(prosemirrorNode, {
			state: editorState,
			dispatchTransaction
		});
		activeEditorView.set(editorView);
	});

	onDestroy(() => {
		// Guard on server side
		if (editorView) {
			editorView.destroy();
		}
	});
	let schema = $derived(multiLine ? multiLinePlainTextSchema : singleLinePlainTextSchema);
	run(() => {
		const doc = fromHTML(schema, content);
		editorState = EditorState.create({
			doc,
			schema,
			plugins: [keymap(buildKeymap(schema)), keymap(baseKeymap), history(), onUpdatePlugin]
		});
		// Only if there is already an editorView and the content change was external
		// update editorView with the new editorState
		if (!editorChange) {
			editorView?.updateState(editorState);
		} else {
			editorChange = false;
		}
	});
</script>

<div id="prosemirror-editor" bind:this={prosemirrorNode}></div>

<style>
	:global(#prosemirror-editor .ProseMirror) {
		outline: none;
		white-space: pre-wrap;
		word-wrap: break-word;
	}
</style>
