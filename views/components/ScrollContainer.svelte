<script>
  import TextBox from "./TextBox.svelte";
  import Scroller from "./Scroller.svelte";
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
    previousAspectRatio,
    nextAspectRatio,
    imageHeight,
    paddingBottom;

  $: {
    aspectRatio = images[index].width / images[index].height;
    previousAspectRatio =
      index !== 0
        ? images[index - 1].width / images[index - 1].height
        : undefined;
    nextAspectRatio =
      images.length - 1 > index
        ? images[index + 1].width / images[index + 1].height
        : undefined;
    imageHeight = containerWidth / aspectRatio;
    // if the vertical center is smaller than 90px set distance to top to account for header
    // else set distance to top to vertical center
    const verticalCenter = windowHeight / 2 - imageHeight / 2;
    if (verticalCenter < 90 && variant === "large") {
      top = 90;
    } else {
      top = verticalCenter;
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

  // Asserts if adjacent image(s) have different aspect ratio
  function aspectRatioChanges(svelteLoopIndex, index, imgArrayLength) {
    const svelteLoopIndexReversed = Math.abs(
      svelteLoopIndex - (imgArrayLength - 1)
    );
    const isPreviousImg = index - 1 === svelteLoopIndexReversed;
    const isCurrentImg = index === svelteLoopIndexReversed;
    const isNextImg = index + 1 === svelteLoopIndexReversed;
    const comparableAspectRatios = {
      previous: Math.round(previousAspectRatio * 10000),
      current: Math.round(aspectRatio * 10000),
      next: Math.round(nextAspectRatio * 10000),
    };

    if (isPreviousImg) {
      return comparableAspectRatios.current !== comparableAspectRatios.previous;
    } else if (isCurrentImg) {
      return (
        (comparableAspectRatios.previous &&
          comparableAspectRatios.current !== comparableAspectRatios.previous) ||
        (comparableAspectRatios.next &&
          comparableAspectRatios.current !== comparableAspectRatios.next)
      );
    } else if (isNextImg) {
      return comparableAspectRatios.current !== comparableAspectRatios.next;
    }
  }
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
      {#each imageUrlsReverse as { id, image }, i}
        {#if image && [index - 1, index, index + 1].includes(id)}
          <!-- 
            Fade out animation is skipped if the appearing image has not the same aspect ratio.
            Instead the appearing image is faded in.
            Otherwise the fading image changes dimensions because it applies the updated 'imageHeight' of the appearing image during fade out.
          -->
          <img
            class="q-scroll-graphic-image"
            class:q-scroll-graphic-image--transition-animation={item.options
              .disableAnimation === undefined || !item.options.disableAnimation}
            class:q-scroll-graphic-image--fade-in-transition-animation={!item
              .options.disableAnimation &&
              aspectRatioChanges(i, index, imageUrlsReverse.length)}
            class:q-scroll-graphic-image--horizontal-fit={imageHeight <=
              windowHeight - top}
            class:q-scroll-graphic-image--vertical-fit={imageHeight >
              windowHeight - top}
            class:q-scroll-graphic-image--hidden={[
              index - 1,
              index + 1,
            ].includes(id)}
            src={image.image2x}
            srcset="{image.image1x} 1x, {image.image2x} 2x, {image.image3x} 3x, {image.image4x} 4x"
            alt=""
          />
        {/if}
      {/each}
    </div>
  </div>

  <div slot="foreground" class="s-font-text">
    <div style="height: 80vh; max-height: {maxHeight}px;" />
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
    visibility: visible;
    opacity: 1;
  }

  .q-scroll-graphic-image--horizontal-fit {
    width: 100%;
  }

  .q-scroll-graphic-image--vertical-fit {
    height: 100%;
    left: 50%;
    transform: translate(-50%, 0);
  }

  .q-scroll-graphic-image--hidden {
    visibility: hidden;
    opacity: 0;
    /* On Safari the image will flicker without z-index: 1 */
    z-index: 1;
  }

  .q-scroll-graphic-image--transition-animation.q-scroll-graphic-image--hidden,
  .q-scroll-graphic-image--transition-animation.q-scroll-graphic-image--fade-in-transition-animation {
    transition: opacity 0.35s ease-out, visibility 0.35s ease-out;
  }

  .q-scroll-graphic-image--transition-animation.q-scroll-graphic-image--hidden.q-scroll-graphic-image--fade-in-transition-animation {
    transition: none;
  }
</style>
