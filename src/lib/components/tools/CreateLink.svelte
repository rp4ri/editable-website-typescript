<script lang="ts">
  import { classNames } from '$lib/utils';
  import { toggleMark } from 'prosemirror-commands';
  import { createLink } from '$lib/editor/prosemirrorCommands';
  
  import type { EditorView } from 'prosemirror-view';
  import type { EditorState } from 'prosemirror-state';
  
  export let editorView: EditorView;
  export let editorState: EditorState;

  $: schema = editorState.schema;
  $: disabled = !createLink(editorState);

  function handleClick() {
    let url = prompt('Enter link URL', 'https://example.com');
    if (url) {
      toggleMark(schema.marks.link, { href: url })(editorState, editorView.dispatch);
      editorView.focus();
    }
  }
</script>

<button
  on:click={handleClick}
  {disabled}
  class={classNames('disabled:opacity-30 rounded-full p-2 sm:mx-1 hover:bg-gray-100')}
>
  <slot />
</button>
