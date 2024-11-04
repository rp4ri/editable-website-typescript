<script lang="ts">
	import Limiter from '$lib/components/Limiter.svelte';
	export let form: { incorrect: boolean };
</script>

<Limiter>
	<div class="pt-20">
		{#if form?.incorrect}
			<p class="my-4 rounded-md bg-red-100 p-4 text-red-600">Error while signing out.</p>
		{:else}
			Successfully logged out. <a class="underline" href="/">Continue</a>.
		{/if}
	</div>
</Limiter>
