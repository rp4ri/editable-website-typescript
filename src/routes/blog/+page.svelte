<script lang="ts">
	import { classNames } from '$lib/utils';
	import { goto } from '$app/navigation';
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';
	import LoginMenu from '$lib/components/LoginMenu.svelte';
	// import ArticleTeaser from '$lib/components/ArticleTeaser.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import EditableWebsiteTeaser from '$lib/components/EditableWebsiteTeaser.svelte';
	import SecondaryButton from '$lib/components/SecondaryButton.svelte';
	import { currentUser } from '$lib/stores.js';
	import WebsiteHeader from '$lib/components/WebsiteHeader.svelte';

	export let data;
	let showUserMenu: boolean;
	$: {
		$currentUser = data.currentUser;
	}
</script>

<svelte:head>
	<title>Blog</title>
	<meta name="description" content="What you always wanted to know about web development." />
</svelte:head>

<WebsiteHeader bind:showUserMenu>
	<div class="flex w-full flex-col space-y-4 p-4 sm:p-6">
		<PrimaryButton type="button" on:click={() => goto('/blog/new')}>New blog post</PrimaryButton>
		<LoginMenu />
	</div>
</WebsiteHeader>

<div class="pb-8">
	<div class="mx-auto max-w-screen-md px-6 pt-12 sm:pt-24">
		<div class="text-sm font-bold">LATEST ARTICLES</div>
		{#if data.articles.length === 0}
			<div class="py-4 md:text-xl">No blog posts have been published so far.</div>
		{/if}
	</div>

	{#each data.articles as article, i}
		<!-- <ArticleTeaser {article} firstEntry={i === 0} /> -->
		<!-- <div> -->
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
		<!-- </div> -->
	{/each}
</div>

<EditableWebsiteTeaser />

<Footer counter="/blog" />
