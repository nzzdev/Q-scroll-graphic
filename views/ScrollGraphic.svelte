<script>
  import ScrollContainer from "./components/ScrollContainer.svelte";

  export let item;
  export let imageServiceUrl;

  let containerWidth;
  const texts = item.steps.map((step) => step.text);
  const images = {
    small: [],
    large: [],
  };

  item.steps.map((step) => {
    const smallVariant = step.variants.find(
      (variant) => !variant.minWidth || variant.minWidth < 500
    );
    if (smallVariant) {
      images.small.push(smallVariant.asset.key);
    }

    const largeVariant = step.variants.find(
      (variant) => variant.minWidth && variant.minWidth >= 500
    );
    if (largeVariant) {
      images.large.push(largeVariant.asset.key);
    }
  });

  function resolveImage(key, containerWidth) {
    let width = 327 * 3;
    if (containerWidth) {
      width = containerWidth * 3;
    }
    return imageServiceUrl
      .replace("{key}", key)
      .replace("{width}", width)
      .replace("{format}", "webpll");
  }
</script>

<div bind:clientWidth={containerWidth}>
  <ScrollContainer {containerWidth} {resolveImage} {images} {texts} />
</div>
