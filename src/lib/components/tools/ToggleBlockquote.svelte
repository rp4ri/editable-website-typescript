<script lang="ts">
  import { classNames } from '$lib/utils';
  import { wrapIn } from 'prosemirror-commands';

  import type { EditorView } from 'prosemirror-view';
  import type { EditorState } from 'prosemirror-state';

  export let editorView: EditorView;
  export let editorState: EditorState;

  $: schema = editorState.schema;
  $: disabled = !wrapIn(schema.nodes.blockquote)(editorView.state);

  function handleClick() {
    wrapIn(schema.nodes.blockquote)(editorState, editorView.dispatch);
    editorView.focus();
  }
</script>

<button
  on:click={handleClick}
  {disabled}
  class={classNames('disabled:opacity-30 rounded-full sm:mx-1 p-2 hover:bg-gray-100')}
>
  <slot />
</button>
