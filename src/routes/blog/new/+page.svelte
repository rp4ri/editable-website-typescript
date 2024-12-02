<script lang="ts">
	import { run } from 'svelte/legacy';

	import { extractTeaser, fetchJSON, formatDate } from '$lib/utils';
	import { goto } from '$app/navigation';
	import Footer from '$lib/components/Footer.svelte';
	import EditableWebsiteTeaser from '$lib/components/EditableWebsiteTeaser.svelte';
	// import Article from '$lib/components/Article.svelte';
	import NotEditable from '$lib/components/NotEditable.svelte';
	import { currentUser, isEditing } from '$lib/stores';
	import WebsiteHeader from '$lib/components/WebsiteHeader.svelte';

	import PlainText from '$lib/components/PlainText.svelte';
	import RichText from '$lib/components/RichText.svelte';

	let { data } = $props();

	let published_at: string | undefined = undefined;

	let showUserMenu = $state(false),
		title = $state('Untitled'),
		content = $state('Copy and paste your text here.');

	run(() => {
		$currentUser = data.currentUser;
		$isEditing = true;
	});

	async function createArticle() {
		if (!$currentUser) {
			return alert('Sorry, you are not authorized to create new articles.');
		}
		const teaser = extractTeaser(document.getElementById('article_content') as HTMLElement);
		try {
			const result = await fetchJSON('POST', '/api/create-article', {
				title,
				content,
				teaser
			});
			if (result && typeof result === 'object' && 'slug' in result) {
				goto(`/blog/${result.slug}`);
			}
		} catch (err) {
			console.error(err);
			alert('A document with that title has already been published. Choose a different title.');
		}
	}

	async function discardDraft() {
		goto('/blog');
	}
</script>

<svelte:head>
	<title>New blog post</title>
</svelte:head>

<WebsiteHeader bind:showUserMenu on:cancel={discardDraft} on:save={createArticle} />

<!-- <Article bind:title bind:content /> -->
<div>
	<div class="mx-auto max-w-screen-md px-6">
		<div class="pt-12 sm:pt-24">
			{#if published_at}
				<div class="text-sm font-bold">{formatDate(published_at, true)}</div>
			{:else}
				<div class="text-sm font-bold">DRAFT</div>
			{/if}
		</div>
		<h1 class="pt-1 text-3xl font-bold md:text-5xl">
			<PlainText bind:content={title} />
		</h1>
	</div>
</div>

<div class="mx-auto max-w-screen-md px-6 pb-12 sm:pb-24">
	<div id="article_content" class="prose sm:prose-xl">
		<RichText multiLine bind:content />
	</div>
</div>

<NotEditable>
	<EditableWebsiteTeaser />
</NotEditable>

<Footer counter="/blog/new" />
