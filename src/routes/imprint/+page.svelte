<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import PlainText from '$lib/components/PlainText.svelte';
	import RichText from '$lib/components/RichText.svelte';
	import LoginMenu from '$lib/components/LoginMenu.svelte';
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';
	import { fetchJSON } from '$lib/utils';
	import { currentUser, isEditing } from '$lib/stores';
	import WebsiteHeader from '$lib/components/WebsiteHeader.svelte';

	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let showUserMenu: boolean = $state(false);
	let title: string = $state('');
	let imprint: string = $state('');

	// --------------------------------------------------------------------------
	// DEFAULT PAGE CONTENT - ADJUST TO YOUR NEEDS
	// --------------------------------------------------------------------------

	function initOrReset(): void {
		$currentUser = data.currentUser;
		title = data.page?.title || 'Imprint';
		imprint =
			data.page?.imprint ||
			[
				['Ken Experiences GmbH', 'Mozartstraße 56', '4020 Linz, Austria'].join('<br/>'),
				[
					'Managing Director: DI Michael Aufreiter',
					'Register No: FN 408728x',
					'Court: Linz',
					'VAT ID: ATU68395257'
				].join('<br/>')
			]
				.map((text) => `<p>${text}</p>`)
				.join('\n');
	}

	initOrReset();

	function toggleEdit(): void {
		$isEditing = true;
		showUserMenu = false;
	}

	async function savePage(): Promise<void> {
		if (!$currentUser) {
			alert('Sorry, you are not authorized.');
			return;
		}
		try {
			await fetchJSON('POST', '/api/save-page', {
				pageId: 'imprint',
				page: {
					title,
					imprint
				}
			});
			$isEditing = false;
		} catch (err) {
			console.error(err);
			alert('There was an error. Please try again.');
		}
	}
</script>

<svelte:head>
	<title>Imprint</title>
</svelte:head>

<WebsiteHeader bind:showUserMenu on:cancel={initOrReset} on:save={savePage}>
	<PrimaryButton on:click={toggleEdit}>Edit page</PrimaryButton>
	<LoginMenu />
</WebsiteHeader>

<div class="py-12 sm:py-24">
	<div class="mx-auto max-w-screen-md px-6 md:text-xl">
		<h1 class="pb-8 text-4xl font-bold md:text-7xl">
			<PlainText bind:content={title} />
		</h1>
		<div class="prose pb-12 md:prose-xl sm:pb-24">
			<RichText multiLine bind:content={imprint} />
		</div>
	</div>
</div>

<Footer counter="/imprint" />
