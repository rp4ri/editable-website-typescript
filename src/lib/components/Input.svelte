<script lang="ts">
	interface Props {
		value?: string;
		id: any;
		type?: string;
		name: any;
		required?: boolean;
		inputRef?: any;
		placeholder?: string;
	}

	let {
		value = $bindable(''),
		id,
		type = 'text',
		name,
		required = false,
		inputRef = $bindable(null),
		placeholder = ''
	}: Props = $props();
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
	class="focus border focus:border-gray-800 focus:ring-gray-800"
/>
