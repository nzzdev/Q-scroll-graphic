<script>
  import ScrollContainer from "./components/ScrollContainer.svelte";
  import Footer from "./components/Footer.svelte";

  export let item;
  export let imageServiceUrl;

  if (!item.options) {
    item.options = {};
  }

  let containerWidth;
</script>

<div bind:clientWidth={containerWidth}>
  {#if containerWidth}
    <ScrollContainer {containerWidth} {imageServiceUrl} {item} />
  {/if}
  <Footer {item} />
</div>
