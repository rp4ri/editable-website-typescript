<script lang="ts">
	import PlainText from '$lib/components/PlainText.svelte';
	import RichText from '$lib/components/RichText.svelte';
	import { fetchJSON } from '$lib/utils';
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';
	import SecondaryButton from '$lib/components/SecondaryButton.svelte';
	import LoginMenu from '$lib/components/LoginMenu.svelte';
	import NotEditable from '$lib/components/NotEditable.svelte';
	import { currentUser, isEditing } from '$lib/stores.js';
	import WebsiteHeader from '$lib/components/WebsiteHeader.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Testimonial from '$lib/components/Testimonial.svelte';
	import Image from '$lib/components/image-editor/Image.svelte';

	import * as Avatar from '$lib/components/ui/avatar/index.js';

	import type { HomeData, IntroStepData, TestimonialData, Article } from '$lib/types/home';

	let { data } = $props();

	// --------------------------------------------------------------------------
	// DEFAULT PAGE CONTENT - AJDUST TO YOUR NEEDS
	// --------------------------------------------------------------------------
	const EMAIL = 'michael@letsken.com';

	// Can contain spaces but must not contain the + sign
	const PHONE_NUMBER = '43 664 1533015';

	const FAQS_PLACEHOLDER = `
        <h2>Question 1</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mi lectus, pellentesque nec urna eget, pretium dictum arcu. In rutrum pretium leo, id efficitur nisl ullamcorper sit amet.</p>
    <h2>Question 2</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mi lectus, pellentesque nec urna eget, pretium dictum arcu. In rutrum pretium leo, id efficitur nisl ullamcorper sit amet.</p>
    `;

	const BIO_PLACEHOLDER = `
        <p>Modern tools, such as Svelte and Tailwind allow you to easily hand-craft fast and beautiful websites. What’s missing is the ability to <strong>make edits without changing the source code</strong>.</p>
        <p>With this <a href="https://github.com/michael/editable-website">open-source website template</a>, I want to fill that gap.</p>
    <p>If you have questions or need any help, contact me.</p>
    `;

	const TESTIMONIALS_PLACEHOLDER = [
		{
			text: '“Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mi lectus, pellentesque nec urna eget, pretium dictum arcu. In rutrum pretium leo, id efficitur nisl ullamcorper sit amet.”',
			image: '/images/person-placeholder.jpg',
			name: 'Jane Doe · jane-doe.org'
		}
	];

	let title: string = $state(''),
		testimonials: TestimonialData[] = $state([]),
		faqs: string = $state(''),
		introStep1: IntroStepData = $state({
			label: '',
			title: '',
			description: ''
		}),
		introStep2: IntroStepData = $state({
			label: '',
			title: '',
			description: ''
		}),
		introStep3: IntroStepData = $state({
			label: '',
			title: '',
			description: ''
		}),
		introStep4: IntroStepData = $state({
			label: '',
			title: '',
			description: ''
		}),
		bioTitle: string = $state(''),
		bioPicture: string = $state(''),
		bio: string = $state(''),
		showUserMenu: boolean = $state(false);

	function initOrReset(): void {
		$currentUser = data.currentUser;
		title = data.page?.title || 'Untitled Website';
		faqs = data.page?.faqs || FAQS_PLACEHOLDER;

		// Make a deep copy
		testimonials = JSON.parse(JSON.stringify(data.page?.testimonials || TESTIMONIALS_PLACEHOLDER));

		introStep1 = JSON.parse(
			JSON.stringify(
				data.page?.introStep1 || {
					label: 'THE PROBLEM',
					title: 'The problem statement',
					description: 'Describe the problem you are solving in a short sentence.'
				}
			)
		);
		introStep2 = JSON.parse(
			JSON.stringify(
				data.page?.introStep2 || {
					label: 'THE DREAM',
					title: 'This is how it should be.',
					description: 'Describe why it should be like that.'
				}
			)
		);
		introStep3 = JSON.parse(
			JSON.stringify(
				data.page?.introStep3 || {
					label: 'THE REALITY',
					title: 'A statement why it is not that easy.',
					description: 'Describe the reality a bit more.'
				}
			)
		);
		introStep4 = JSON.parse(
			JSON.stringify(
				data.page?.introStep4 || {
					label: 'THE PROMISE',
					title: 'Still the solution is worth it.',
					description: 'And why this is, should be described here.'
				}
			)
		);
		bioPicture = data.page?.bioPicture || '/images/person-placeholder.jpg';
		bioTitle = data.page?.bioTitle || "Hi, I'm Michael — I want your website to be editable.";
		bio = data.page?.bio || BIO_PLACEHOLDER;
		$isEditing = false;
	}

	// --------------------------------------------------------------------------
	// Page logic
	// --------------------------------------------------------------------------
	function toggleEdit(): void {
		$isEditing = true;
		showUserMenu = false;
	}

	function addTestimonial(): void {
		testimonials.push({
			text: '“Add a quote text here”',
			image: '/images/person-placeholder.jpg',
			name: 'Firstname Lastname · example.com'
		});
		testimonials = testimonials; // trigger update
	}

	function deleteTestimonial(index: number): void {
		testimonials.splice(index, 1);
		testimonials = testimonials; // trigger update
	}

	function moveTestimonial(index: number, direction: 'up' | 'down'): void {
		let toIndex: number;
		if (direction === 'up' && index > 0) {
			toIndex = index - 1;
		} else if (direction === 'down' && index < testimonials.length - 1) {
			toIndex = index + 1;
		} else {
			return; // operation not possible
		}
		// Remove item from original position
		const element = testimonials.splice(index, 1)[0];
		// Insert at new position
		testimonials.splice(toIndex, 0, element);
		testimonials = testimonials; // trigger update
	}

	async function savePage(): Promise<void> {
		try {
			// Only persist the start page when logged in as an admin
			if ($currentUser) {
				await fetchJSON('POST', '/api/save-page', {
					pageId: 'home',
					page: {
						title,
						faqs,
						testimonials,
						introStep1,
						introStep2,
						introStep3,
						introStep4,
						bioPicture,
						bioTitle,
						bio
					}
				});
			}
			$isEditing = false;
		} catch (err) {
			console.error(err);
			alert('There was an error. Please try again.');
		}
	}

	initOrReset();
</script>

<svelte:head>
	<title>Make your website editable</title>
	<meta name="description" content="Make changes to your website while browsing it." />
	<link rel="alternate" hreflang="en" href="https://editable.website" />
	<link rel="canonical" href="https://editable.website" />
</svelte:head>

<WebsiteHeader bind:showUserMenu on:cancel={initOrReset} on:save={savePage}>
	<PrimaryButton on:click={toggleEdit}>Edit page</PrimaryButton>
	<LoginMenu />
</WebsiteHeader>

<div>
	<div class="mx-auto max-w-screen-md px-6 pt-12 sm:pt-24">
		<NotEditable>
			<svg
				class="mx-auto w-14 pb-8 sm:w-24"
				viewBox="0 0 200 200"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d="M164 110L64 163.768V200L164 147.059V110Z" fill="#111827" />
				<path d="M136 66L36 119.768V156L136 103.059V66Z" fill="#111827" />
				<path d="M164 0L64 53.7684V90L164 37.0588V0Z" fill="#111827" />
			</svg>
		</NotEditable>
		<h1 class="text-center text-4xl font-bold md:text-7xl">
			<PlainText bind:content={title} />
		</h1>
		<NotEditable>
			<div class="bounce pb-4 pt-8 text-center text-xl">↓</div>
			<div class="text-center">
				<PrimaryButton size="lg" type="button" on:click={toggleEdit}>Edit</PrimaryButton>
			</div>
		</NotEditable>
	</div>
</div>

<div class="border-b-2 border-gray-100 pt-12 md:pt-24">
	<div class="mx-auto max-w-screen-md px-6">
		<div class="relative">
			<div class="absolute inset-0 -top-8 bottom-12 z-0 mx-auto w-1 bg-gray-900">
				<div class="absolute -left-[6px] -top-1 h-4 w-4 rounded-full bg-gray-900"></div>
			</div>
			<div class="z-10">
				{#each [introStep1, introStep2, introStep3, introStep4] as intro, i}
					<div class="my-12">
						<div class="relative mb-20 mt-20 bg-white py-8">
							<div class="text-center text-sm font-bold sm:text-base">
								<PlainText bind:content={intro.label} />
							</div>
							<div class="pt-2 text-center text-2xl font-bold md:text-5xl">
								<PlainText bind:content={intro.title} />
							</div>
							<div class="mx-auto max-w-md pt-2 text-center text-lg md:pt-4 md:text-2xl">
								<RichText bind:content={intro.description} />
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
		<div class="relative h-14">
			<div class="absolute inset-0 -top-16 bottom-12 z-0 mx-auto w-1 bg-gray-900">
				<div
					class="absolute -bottom-2 -left-[7px] h-0 w-0 border-x-[9px] border-t-[10px] border-gray-900 border-x-transparent"
				></div>
			</div>
		</div>
		<div class="mb-32 text-center">
			<PrimaryButton
				size="lg"
				type="button"
				on:click={() =>
					document
						.getElementById('contact')
						?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
				>Create an editable website</PrimaryButton
			>
		</div>
	</div>
</div>

<div class="bg-white pb-6 sm:pb-12">
	<div class="mx-auto max-w-screen-md px-6">
		<div class="py-12 pb-8 text-sm font-bold sm:pt-24 sm:text-base">WHAT PEOPLE SAY</div>
	</div>
	{#each testimonials as _, i}
		<Testimonial
			bind:testimonial={testimonials[i]}
			firstEntry={i === 0}
			lastEntry={i === testimonials.length - 1}
			on:delete={() => deleteTestimonial(i)}
			on:up={() => moveTestimonial(i, 'up')}
			on:down={() => moveTestimonial(i, 'down')}
		/>
	{/each}

	{#if $isEditing}
		<div class="border-b border-gray-100 pb-12 text-center">
			<SecondaryButton on:click={addTestimonial}>Add testimonial</SecondaryButton>
		</div>
	{/if}
</div>

<!-- Bio -->
<div id="contact" class="border-b-2 border-t-2 border-gray-100 bg-white pb-12 sm:pb-24">
	<div class="mx-auto max-w-screen-md px-6">
		<div class="pb-12 pt-12 text-center sm:pt-24">
			<div class="relative mx-auto h-48 w-48 overflow-hidden rounded-full md:h-72 md:w-72">
				<Image
					class="block h-48 w-48 rounded-full md:h-72 md:w-72"
					maxWidth={384}
					maxHeight={384}
					quality={0.8}
					bind:src={bioPicture}
					alt="Michael Aufreiter"
				/>
			</div>
		</div>
		<div class="">
			<h1 class="text-3xl font-bold md:text-5xl">
				<PlainText bind:content={bioTitle} />
			</h1>
		</div>
		<div class="prose pb-6 md:prose-xl">
			<RichText multiLine bind:content={bio} />
		</div>

		<NotEditable>
			<div class="flex flex-col space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0 md:space-x-8">
				<PrimaryButton size="lg" href={`mailto:${EMAIL}`}>Email</PrimaryButton>
				<SecondaryButton size="lg" href={`https://wa.me/${PHONE_NUMBER.replace(/\s+/g, '')}`}>
					WhatsApp (+{PHONE_NUMBER})
				</SecondaryButton>
			</div>
		</NotEditable>
	</div>
</div>

<!-- FAQs -->
<div class="bg-white">
	<div class="mx-auto max-w-screen-md px-6">
		<div class="-mb-6 pt-12 text-sm font-bold sm:pt-24 sm:text-base md:-mb-12">FAQs</div>
		<div class="prose pb-12 md:prose-xl sm:pb-24">
			<RichText multiLine bind:content={faqs} />
		</div>
	</div>
</div>

<Footer counter="/" />
