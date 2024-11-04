<script lang="ts">
  import { classNames, resizeImage, getDimensions, nanoid, is_safari } from '$lib/utils';
  import uploadAsset from '$lib/uploadAsset';
  import { insertImage } from '$lib/editor/prosemirrorCommands';
  import { currentUser } from '$lib/stores';
	import type { EditorView } from 'prosemirror-view';
  import type { EditorState } from 'prosemirror-state';

  export let editorView: EditorView;
  export let editorState: EditorState;

  let fileInput: HTMLInputElement | null = null; // for uploading an image
  let progress: number | undefined = undefined; // file upload progress

  $: schema = editorState.schema;
  $: disabled = !insertImage(editorState);

  async function uploadImage(): Promise<void> {
    if (!fileInput) return;

    const file = fileInput.files?.[0];
    if (!file) return;

    // We convert all uploads to the WEBP image format
    const content_type = is_safari() ? 'image/jpeg' : 'image/webp';

    // We convert all uploads to the WEBP image format if possible
    const extension = is_safari() ? 'jpg' : 'webp';

    const path = [['images', nanoid()].join('/'), extension].join('.');
    const maxWidth = 1440;
    const maxHeight = 1440;
    const quality = 0.8;

    const resizedBlob = await resizeImage(file, maxWidth, maxHeight, quality, content_type);
    const resizedFile = new File([resizedBlob], `${file.name.split('.')[0]}.${extension}`, {
      type: content_type
    });

    const { width, height } = await getDimensions(resizedFile);
    const src = $currentUser ? `/assets/${path}` : URL.createObjectURL(resizedFile);

    progress = 0;
    try {
      if ($currentUser) {
        await uploadAsset(resizedFile, path, (p: number) => {
          progress = p;
        });
      }

      const imageNode = schema.nodes.image.createAndFill({
        src,
        width,
        height
      });

      if (imageNode) {
        editorView.dispatch(
          editorState.tr.replaceSelectionWith(imageNode)
        );
      }
      editorView.focus();
      progress = undefined;
    } catch (err) {
      console.error(err);
      progress = undefined;
    }

    if (fileInput) {
      fileInput.value = '';
    }
  }

  function handleClick(): void {
    if (fileInput) {
      fileInput.click();
    }
  }
</script>

<input
  class="w-px h-px opacity-0 fixed -top-40"
  type="file"
  accept="image/*"
  name="imagefile"
  multiple
  bind:this={fileInput}
  on:change={uploadImage}
/>
<button
  on:click={handleClick}
  {disabled}
  class={classNames('hover:bg-gray-100 sm:mx-1 rounded-full p-2 disabled:opacity-30')}
>
  <slot />
  {progress || ''}
</button>