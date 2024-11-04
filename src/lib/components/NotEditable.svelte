<script lang="ts">
  import { classNames } from '$lib/utils';
  import { isEditing } from '$lib/stores';
</script>

<div class={classNames($isEditing ? 'opacity-25 cursor-not-allowed relative' : '')}>
  {#if $isEditing}
    <div class="absolute inset-0 z-50" ></div>
  {/if}
  <slot />
</div>
