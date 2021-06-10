<script>
  import TextBox from "./TextBox.svelte";
  import Scroller from "./Scroller.svelte";
  import { fade } from "svelte/transition";
  import { getImageUrls, getPreloadImageUrl } from "./helpers.js";

  export let imageServiceUrl;
  export let containerWidth;
  export let imageVariants;
  export let texts;

  $: maxHeight = 2 * containerWidth;
  $: variant = containerWidth < 500 ? "small" : "large";
  $: aspectRatio =
    imageVariants[variant][0].width / imageVariants[variant][0].height;

  let index, offset, progress, windowHeight, images;
  const padding = 32;

  // Glue to top of page (counting 90px for header) on mobile, center vertically on desktop
  $: minHeaderSpace = variant === "small" ? 90 : Infinity;

  $: imageHeight = containerWidth / aspectRatio;
  $: top =
    Math.min(minHeaderSpace, windowHeight / 2 - imageHeight / 2) - padding;
  $: bottom = top + imageHeight + 2 * padding;

  $: images = imageVariants[variant].map((image) =>
    getImageUrls(image, containerWidth, imageServiceUrl)
  );

  $: imagesReverse = images.map((image, id) => ({ id, image })).reverse();

  let preloadedUntil = -1;
  $: if (index !== undefined) {
    // Always preload the next image, so the loading is usually not visible
    preloadImagesUntil(images, index + 1);
  }

  function preloadImagesUntil(images, index) {
    for (let i = preloadedUntil + 1; i <= index; i += 1) {
      if (images[i]) {
        new Image().src = getPreloadImageUrl(images[i]);
      }
    }
    preloadedUntil = Math.max(preloadedUntil, index);
  }
</script>

<svelte:window bind:innerHeight={windowHeight} />

<Scroller
  threshold={0}
  top={top / windowHeight}
  bottom={bottom / windowHeight}
  bind:index
  bind:offset
  bind:progress
>
  <div slot="background">
    <div class="q-scroll-graphic-background">
      <!-- Use images in reverse order, so the z-order is correct automatically:
              Image n is on top and fades out
              Image n+1 is below and becomes visible
              => smooth transition n to n+1
      -->
      {#each imagesReverse as { id, image }}
        {#if id === Math.min(index, imagesReverse.length - 1)}
          <picture>
            <source
              type="image/webp"
              srcset="{image.webp1x} 1x, {image.webp2x} 2x, {image.webp3x} 3x, {image.webp4x} 4x"
            />
            <source
              srcset="{image.png1x} 1x, {image.png2x} 2x, {image.png3x} 3x, {image.png4x} 4x"
            />
            <img
              src={image.png1x}
              alt=""
              style="padding-top: {padding}px"
              out:fade
            />
          </picture>
        {/if}
      {/each}
    </div>
  </div>

  <div slot="foreground" class="s-font-text">
    <section style="height: 20vh; max-height: {maxHeight}px;" />
    <section style="height: 80vh; max-height: {maxHeight}px;" />
    {#each texts as text}
      {#if text}
        <TextBox {maxHeight} {variant}>
          {@html text}
        </TextBox>
      {/if}
    {/each}
  </div>
</Scroller>

<style>
  .q-scroll-graphic-background {
    position: relative;
  }

  img {
    width: 100%;
    position: absolute;
  }
</style>
