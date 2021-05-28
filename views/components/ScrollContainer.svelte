<script>
  import TextBox from "./TextBox.svelte";
  import Scroller from "./Scroller.svelte";
  import { fade } from "svelte/transition";

  export let resolveImage;
  export let containerWidth;
  export let images;
  export let texts;

  const aspectRatios = {
    small: 701 / 936,
    large: 1741 / 957,
  };

  $: maxHeight = 2 * containerWidth;
  $: variant = containerWidth < 500 ? "small" : "large";
  $: aspectRatio = aspectRatios[variant];

  let index, offset, progress;
  let windowHeight;

  const padding = 32;

  // Glue to top of page (counting 90px for header) on mobile, center vertically on desktop
  $: minHeaderSpace = variant === "small" ? 90 : Infinity;

  $: imageHeight = containerWidth / aspectRatio;
  $: top =
    Math.min(minHeaderSpace, windowHeight / 2 - imageHeight / 2) - padding;
  $: bottom = top + imageHeight + 2 * padding;

  $: imageUrls = images[variant].map((image) =>
    resolveImage(image, containerWidth)
  );
  $: imageUrlsReverse = imageUrls.map((url, id) => ({ id, url })).reverse();

  let preloadedUntil = -1;
  $: if (index !== undefined) {
    // Always preload the next image, so the loading is usually not visible
    preloadImagesUntil(imageUrls, index + 1);
  }

  function preloadImagesUntil(imageUrls, index) {
    for (let i = preloadedUntil + 1; i <= index; i += 1) {
      new Image().src = imageUrls[i];
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
      {#each imageUrlsReverse as { id, url }}
        {#if id === Math.min(index, imageUrlsReverse.length - 1)}
          <img src={url} alt="Haus" style="padding-top: {padding}px" out:fade />
        {/if}
      {/each}
    </div>
  </div>

  <div slot="foreground" class="s-font-text">
    <section style="height: 20vh; max-height: {maxHeight}px;" />
    <section style="height: 80vh; max-height: {maxHeight}px;" />
    {#each texts as text}
      <TextBox {maxHeight} {variant}>
        {@html text}
      </TextBox>
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
