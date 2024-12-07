<script lang="ts">
	import { run } from 'svelte/legacy';

	import { classNames, extractTeaser, fetchJSON, formatDate } from '$lib/utils';
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';
	import WebsiteNav from '$lib/components/WebsiteNav.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import LoginMenu from '$lib/components/LoginMenu.svelte';
	import { goto } from '$app/navigation';
	import Footer from '$lib/components/Footer.svelte';
	// import ArticleTeaser from '$lib/components/ArticleTeaser.svelte';
	import EditableWebsiteTeaser from '$lib/components/EditableWebsiteTeaser.svelte';
	// import Article from '$lib/components/Article.svelte';
	import NotEditable from '$lib/components/NotEditable.svelte';
	import EditorToolbar from '$lib/components/tools/EditorToolbar.svelte';
	import { currentUser, isEditing } from '$lib/stores';

	import PlainText from '$lib/components/PlainText.svelte';
	import RichText from '$lib/components/RichText.svelte';

	import SecondaryButton from '$lib/components/SecondaryButton.svelte';

	let { data } = $props();

	let showUserMenu = $state(false);
	let title: string = $state('');
	let teaser: string = $state('');
	let content: string = $state('');
	let published_at: string = $state('');
	let updatedAt: string = $state('');

	function initOrReset() {
		title = data.title;
		teaser = data.teaser;
		content = data.content || '';
		published_at = data.published_at || '';
		updatedAt = data.updated_at || '';
		$isEditing = false;
	}

	function toggleEdit() {
		$isEditing = true;
		showUserMenu = false;
	}

	async function deleteArticle() {
		if (!$currentUser) return alert('Sorry, you are not authorized.');
		try {
			fetchJSON('POST', '/api/delete-article', {
				slug: data.slug
			});
			goto('/blog');
		} catch (err) {
			console.error(err);
			alert('Error deleting the article. Try again.');
			window.location.reload();
		}
	}

	async function saveArticle() {
		if (!$currentUser) return alert('Sorry, you are not authorized.');
		const teaser = extractTeaser(document.getElementById('article_content') as HTMLElement);
		try {
			const result = await fetchJSON('POST', '/api/update-article', {
				slug: data.slug,
				title,
				content,
				teaser
			});
			$isEditing = false;
		} catch (err) {
			console.error(err);
			alert(
				'There was an error. You can try again, but before that, please just copy and paste your article into a safe place.'
			);
		}
	}
	run(() => {
		$currentUser = data.currentUser;
		initOrReset();
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={teaser} />
</svelte:head>

<EditorToolbar on:cancel={initOrReset} on:save={saveArticle} />
<WebsiteNav bind:showUserMenu />
{#if showUserMenu}
	<Modal on:close={() => (showUserMenu = false)}>
		<form class="block w-full" method="POST">
			<div class="flex w-full flex-col space-y-4 p-4 sm:p-6">
				<PrimaryButton on:click={toggleEdit}>Edit post</PrimaryButton>
				<PrimaryButton type="button" on:click={deleteArticle}>Delete post</PrimaryButton>
				<LoginMenu />
			</div>
		</form>
	</Modal>
{/if}

<!-- <Article bind:title bind:content bind:published_at /> -->
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

{#if data.articles.length > 0}
	<NotEditable>
		<div class="border-t-2 border-gray-100">
			<div class="mx-auto max-w-screen-md px-6 pt-8 sm:pt-12">
				<div class="text-sm font-bold">READ NEXT</div>
			</div>
			{#each data.articles as article, i}
				<!-- <ArticleTeaser {article} firstEntry={i === 0} /> -->
				<div
					class={classNames(
						'mx-auto max-w-screen-md px-6 md:text-xl',
						i === 0 ? 'pb-8 pt-2 sm:pb-12' : 'py-6 sm:py-10'
					)}
				>
					<div class={classNames(article.published_at ? '' : 'opacity-50')}>
						<div>
							<a
								class={classNames('mb-12 text-2xl font-bold md:text-3xl')}
								href={`/blog/${article.slug}`}
							>
								{article.title}
							</a>
						</div>
						<div class="pb-4 pt-2">
							<div class="line-clamp-4">
								<a href={`/blog/${article.slug}`}>
									{article.teaser}
								</a>
							</div>
						</div>
					</div>
					<div class="pt-2">
						<SecondaryButton size="sm" href={`/blog/${article.slug}`}>
							Continue reading&nbsp;→
						</SecondaryButton>
					</div>
				</div>
			{/each}
		</div>
	</NotEditable>
{/if}

<NotEditable>
	<EditableWebsiteTeaser />
</NotEditable>

<Footer counter={`/blog/${data.slug}`} />
