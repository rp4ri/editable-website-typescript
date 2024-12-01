<script lang="ts">
	import { classNames } from '$lib/utils';
	import PrimaryButton from './PrimaryButton.svelte';
</script>

<div class={classNames('border-t-2 border-gray-100 py-12 sm:py-24')}>
	<div
		class="mx-auto flex max-w-screen-md flex-col space-y-6 px-6 sm:flex-row sm:space-x-8 sm:space-y-0"
	>
		<img
			class="h-24 w-24 flex-shrink-0 rounded-full"
			src="https://letsken.imgix.net/users/958dc1d9-de59-40ee-b814-b43885b3053f/27421e71f9e3ef6f828be3018eb69d74.jpg?fit=max&w=576&auto=format"
			alt="Michael Aufreiter"
		/>
		<div>
			<h2 class="text-3xl font-bold md:text-5xl">Hi, I'm Michael.</h2>
			<div class="mt-4 md:text-xl">
				I want your website to be <strong>editable</strong>.
			</div>
			<div class="pt-8 sm:pt-12">
				<PrimaryButton size="lg" href="/">Learn more</PrimaryButton>
			</div>
		</div>
	</div>
</div>
