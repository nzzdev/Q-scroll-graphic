<script>
  import TextBox from "./TextBox.svelte";
  import Scroller from "./Scroller.svelte";
  import { fade } from "svelte/transition";
  import { getImageUrls } from "./helpers.js";

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

    if (variant && variant.asset) {
      return variant.asset;
    } else {
      return {};
    }
  });

  $: maxHeight = 2 * containerWidth;
  $: variant = containerWidth < 500 ? "small" : "large";

  let index = 0;
  let offset,
    progress,
    windowHeight,
    top,
    bottom,
    aspectRatio,
    imageHeight,
    paddingBottom;

  $: {
    aspectRatio = images[index].width / images[index].height;
    imageHeight = containerWidth / aspectRatio;
    if (variant === "small") {
      // set 90px distance to top on mobile
      top = 90;
    } else {
      // if the vertical center is smaller than 90px set distance to top to account for header
      // else set distance to top to vertical center
      const verticalCenter = windowHeight / 2 - imageHeight / 2;
      if (verticalCenter < 90) {
        top = 90;
      } else {
        top = verticalCenter;
      }
    }

    bottom = top + imageHeight;

    if (imageHeight > windowHeight - top) {
      paddingBottom = windowHeight - top;
    } else {
      paddingBottom = imageHeight;
    }
  }

  $: imageUrls = images.map((image) => {
    if (image && image.key) {
      return getImageUrls(image, containerWidth, imageServiceUrl);
    }
  });

  $: imageUrlsReverse = imageUrls.map((image, id) => ({ id, image })).reverse();
</script>

<svelte:window bind:innerHeight={windowHeight} />

<Scroller
  threshold={0.8}
  top={top / windowHeight}
  bottom={bottom / windowHeight}
  bind:index
  bind:offset
  bind:progress
>
  <div slot="background">
    <div
      class="q-scroll-graphic-background"
      style="padding-bottom: {paddingBottom}px;"
    >
      <!-- Use images in reverse order, so the z-order is correct automatically:
              Image n and n+1 are rendered
              Image n is on top and fades out
              Image n+1 is below and becomes visible
              => smooth transition n to n+1
      -->
      {#each imageUrlsReverse as { id, image }}
        {#if image && [index - 1, index, index + 1].includes(id)}
          <picture>
            <source
              type="image/webp"
              srcset="{image.webp1x} 1x, {image.webp2x} 2x, {image.webp3x} 3x, {image.webp4x} 4x"
            />
            <source
              srcset="{image.png1x} 1x, {image.png2x} 2x, {image.png3x} 3x, {image.png4x} 4x"
            />
            <img
              class="q-scroll-graphic-image"
              class:image--horizontal-fit={imageHeight <= windowHeight - top}
              class:image--vertical-fit={imageHeight > windowHeight - top}
              class:image--hidden={[index - 1, index + 1].includes(id)}
              src={image.png1x}
              alt=""
              transition:fade={{ duration: 50 }}
            />
          </picture>
        {/if}
      {/each}
    </div>
  </div>

  <div slot="foreground" class="s-font-text">
    <div style="height: 100vh; max-height: {maxHeight}px;" />
    {#each item.steps as step}
      <TextBox {item} {maxHeight} {variant} {step} />
    {/each}
  </div>
</Scroller>

<style>
  .q-scroll-graphic-background {
    position: relative;
  }

  .q-scroll-graphic-image {
    position: absolute;
    background: currentColor;
  }

  .image--horizontal-fit {
    width: 100%;
  }

  .image--vertical-fit {
    height: 100%;
    left: 50%;
    transform: translate(-50%, 0);
  }

  .image--hidden {
    visibility: hidden;
  }
</style>
