<script lang="ts">
  export let value = '';
  export let id;
  export let type = 'text';
  export let name;
  export let required = false;
  export let inputRef = null;
  export let placeholder = '';
  function setType(node: HTMLInputElement) {
    node.type = type;
  }
</script>

<input
  autocomplete="off"
  use:setType
  {placeholder}
  {name}
  {id}
  {required}
  bind:value
  bind:this={inputRef}
  class="border focus focus:border-gray-800 focus:ring-gray-800"
/>
