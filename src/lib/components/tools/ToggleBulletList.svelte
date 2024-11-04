<script lang="ts">
  import { classNames } from '$lib/utils';
  import { wrapInList } from 'prosemirror-schema-list';

  import type { EditorView } from 'prosemirror-view';
  import type { EditorState } from 'prosemirror-state';

  export let editorView: EditorView;
  export let editorState: EditorState;

  $: schema = editorState.schema;
  $: disabled = !wrapInList(schema.nodes.bullet_list)(editorView.state);

  function handleClick() {
    wrapInList(schema.nodes.bullet_list)(editorState, editorView.dispatch);
    editorView.focus();
  }
</script>

<button
  on:click={handleClick}
  {disabled}
  class={classNames('disabled:opacity-30 rounded-full p-2 sm:mx-1 hover:bg-gray-100')}
>
  <slot />
</button>
