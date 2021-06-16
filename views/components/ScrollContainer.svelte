<script>
  import TextBox from "./TextBox.svelte";
  import Scroller from "./Scroller.svelte";
  import { fade } from "svelte/transition";
  import { getImageUrls, getPreloadImageUrl } from "./helpers.js";

  export let imageServiceUrl;
  export let containerWidth;
  export let item;

  $: images = item.steps.map((step) => {
    // return the image variant where containerWidth is larger or equal to defined minimal width
    const variant = step.variants
      .map((variant) => {
        if (!variant.minWidth) {
          variant.minWidth = 1;
        }
        return variant;
      })
      .sort((a, b) => b.minWidth - a.minWidth)
      .find((variant) => containerWidth >= variant.minWidth);

    return variant.asset;
  });

  $: maxHeight = 2 * containerWidth;
  $: variant = containerWidth < 500 ? "small" : "large";
  $: aspectRatio = images[0].width / images[0].height;

  let index, offset, progress, windowHeight;
  const padding = 32;

  // Glue to top of page (counting 90px for header) on mobile, center vertically on desktop
  $: minHeaderSpace = variant === "small" ? 90 : Infinity;

  $: imageHeight = containerWidth / aspectRatio;
  $: top =
    Math.min(minHeaderSpace, windowHeight / 2 - imageHeight / 2) - padding;
  $: bottom = top + imageHeight + 2 * padding;

  $: imageUrls = images.map((image) =>
    getImageUrls(image, containerWidth, imageServiceUrl)
  );

  $: imageUrlsReverse = imageUrls.map((image, id) => ({ id, image })).reverse();

  let preloadedUntil = -1;
  $: if (index !== undefined) {
    // Always preload the next image, so the loading is usually not visible
    preloadImagesUntil(imageUrls, index + 1);
  }

  function preloadImagesUntil(imageUrls, index) {
    for (let i = preloadedUntil + 1; i <= index; i += 1) {
      if (imageUrls[i]) {
        new Image().src = getPreloadImageUrl(imageUrls[i]);
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
      {#each imageUrlsReverse as { id, image }}
        {#if id === Math.min(index, imageUrlsReverse.length - 1)}
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
    {#each item.steps as step}
      {#if step.text}
        <TextBox {maxHeight} {variant} text={step.text} />
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
