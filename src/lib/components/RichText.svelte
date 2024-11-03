<script lang="ts">
  import { isEditing } from '$lib/stores';

  export let content: string;
  export let multiLine = false;
</script>

{#if $isEditing}
  {#await import('./RichTextEditor.svelte')}
    {@html content}
  {:then RichTextEditor}
    <RichTextEditor.default {multiLine} bind:content />
  {/await}
{:else}
  <div>
    {@html content}
  </div>
{/if}
