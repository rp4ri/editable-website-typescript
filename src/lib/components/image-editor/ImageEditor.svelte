<script lang="ts">
	import { currentUser } from '$lib/stores';
	import { resizeImage, classNames, getDimensions, is_safari, nanoid } from '$lib/utils';
	import { getCroppedImg } from '$lib/cropperUtil';
	import uploadAsset from '$lib/uploadAsset';
	import Cropper from './Cropper.svelte';

	export let src: string;
	export let alt: string;
	export let uploadPrompt = undefined;
	export let maxWidth: number;
	export let maxHeight: number;
	export let quality: number;
	let className = '';

	export { className as class };

	function onKeyDown(e: KeyboardEvent) {
		// Trigger save
		if (is_cropping && e.key === 'Escape') {
			cancelCropping();
		} else if (is_cropping && e.key === 'Enter') {
			uploadImage();
		}
	}

	let fileInput: HTMLInputElement | null = null; // for uploading an image
	let progress: number | undefined = undefined; // file upload progress
	let overlayEl: HTMLElement | null = null;

	// Cropper stuff
	let newSrc: string | undefined;
	let cropDetail:
		| {
				percent: { x: number; y: number; width: number; height: number };
				pixels: { x: number; y: number; width: number; height: number };
		  }
		| undefined;
	let is_cropping = false;
	let scale = 1;
	let crop = { x: 0, y: 0 };
	let zoom = 1;

	function cancelCropping() {
		is_cropping = false;
		newSrc = undefined;
		if (fileInput) {
			fileInput.value = '';
		}
		scale = 1;
	}

	async function uploadImage() {
		if (!fileInput || !fileInput.files || !cropDetail) {
			return;
		}

		const file = fileInput.files[0];
		const content_type = is_safari() ? 'image/jpeg' : 'image/webp';

		// We convert all uploads to the WEBP image format
		const extension = is_safari() ? 'jpg' : 'webp';
		const path = [['images', nanoid()].join('/'), extension].join('.');
		const croppedImage = await getCroppedImg(newSrc!, cropDetail.pixels);

		if (!croppedImage) {
			console.error('Failed to crop image');
			return;
		}

		const croppedFile = new File([croppedImage], `${file.name.split('.')[0]}.${extension}`, {
			type: content_type,
			lastModified: Date.now()
		});

		const resizedBlob = await resizeImage(croppedFile, maxWidth, maxHeight, quality, content_type);
		const resizedFile = new File([resizedBlob], `${file.name.split('.')[0]}.${extension}`, {
			type: content_type
		});

		progress = 0;
		try {
			if ($currentUser) {
				await uploadAsset(resizedFile, path, (p) => {
					progress = p;
				});
				src = `/assets/${path}`;
			} else {
				src = URL.createObjectURL(resizedFile);
			}
			progress = undefined;
		} catch (err) {
			console.error(err);
			alert('An error occured. Please try again');
			progress = undefined;
		}
		cancelCropping();
		if (fileInput) {
			fileInput.value = '';
		}
	}

	async function startCropping() {
		if (!fileInput || !fileInput.files) {
			return;
		}

		const file = fileInput.files[0];
		const { width, height } = await getDimensions(file);
		const currentAspectRatio = width / height;
		const desiredAspectRatio = maxWidth / maxHeight;

		// HACK: We zoom into the cropper so it fills the whole image area.
		// TODO: We should do this properly by adjusting Cropper.svelte
		if (desiredAspectRatio > currentAspectRatio) {
			scale = desiredAspectRatio / currentAspectRatio;
		} else {
			scale = currentAspectRatio / desiredAspectRatio;
		}

		// Preview image for cropping
		newSrc = URL.createObjectURL(file);
		is_cropping = true;
	}
</script>

<div
	bind:this={overlayEl}
	class={classNames(
		is_cropping
			? 'fixed inset-0 z-40 bg-black bg-opacity-80 p-6 text-center font-bold text-white'
			: 'hidden'
	)}
	on:dblclick={cancelCropping}
	aria-hidden={!is_cropping}
>
	{#if is_safari()}
		<span class="text-[#EF174C]">ATTENTION:</span> Use Google Chrome, Firefox, oder Microsoft Edge for
		optimized image quality and size.
	{:else}
		Confirm with ENTER. Cancel with ESC.
	{/if}
</div>

{#if is_cropping}
	<div class="fixed bottom-0 left-0 right-0 z-[60] flex space-x-4 p-6">
		<div class="flex-1"></div>
		<button class="rounded-full bg-[#EF174C] px-4 py-2 text-white" on:click={uploadImage}
			>Confirm</button
		>
		<button class="rounded-full bg-white px-4 py-2 text-black" on:click={cancelCropping}
			>Cancel</button
		>
		<div class="flex-1"></div>
	</div>
{/if}

<div
	style={`aspect-ratio: ${maxWidth}/${maxHeight}; scale: ${scale}`}
	class={classNames(is_cropping ? `z-50` : '', 'relative')}
	on:dblclick={uploadImage}
	aria-hidden={!is_cropping}
>
	{#if is_cropping && newSrc}
		<Cropper
			image={newSrc}
			bind:crop
			bind:zoom
			on:cropcomplete={(e) => (cropDetail = e.detail)}
			aspect={maxWidth / maxHeight}
		/>
	{:else}
		<img
			on:mousedown={() => fileInput?.click()}
			class={className +
				' cursor-pointer outline-[2px] -outline-offset-[2px] outline-[#EF174C] hover:outline-dashed'}
			{src}
			{alt}
			title={uploadPrompt}
			aria-hidden={!is_cropping}
		/>
	{/if}
</div>

<input
	class="fixed -top-40 h-px w-px opacity-0"
	type="file"
	accept="image/*"
	name="imagefile"
	bind:this={fileInput}
	on:change={startCropping}
/>

<svelte:window on:keydown={onKeyDown} />
