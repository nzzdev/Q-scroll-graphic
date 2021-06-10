<script>
  import ScrollContainer from "./components/ScrollContainer.svelte";

  export let item;
  export let imageServiceUrl;

  let containerWidth;
  const texts = item.steps.map((step) => step.text);
  const imageVariants = {
    small: [],
    large: [],
  };

  item.steps.map((step) => {
    const smallVariant = step.variants.find(
      (variant) => !variant.minWidth || variant.minWidth < 500
    );
    if (smallVariant) {
      imageVariants.small.push(smallVariant.asset);
    }

    const largeVariant = step.variants.find(
      (variant) => variant.minWidth && variant.minWidth >= 500
    );
    if (largeVariant) {
      imageVariants.large.push(largeVariant.asset);
    }
  });
</script>

<div bind:clientWidth={containerWidth}>
  {#if containerWidth}
    <ScrollContainer
      {containerWidth}
      {imageServiceUrl}
      {imageVariants}
      {texts}
    />
  {/if}
</div>
