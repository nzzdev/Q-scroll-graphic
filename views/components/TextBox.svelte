<script>
  export let maxHeight;
  export let variant;
</script>

<section>
  <div class="q-scroll-graphic-text-box">
    <p
      class="s-font-text-s q-scroll-graphic-content q-scroll-graphic-content--{variant}"
    >
      <slot />
    </p>
  </div>
  <div class="q-scroll-graphic-spacer" style="max-height: {maxHeight}px" />
</section>

<style>
  .q-scroll-graphic-text-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    min-height: auto;
  }

  .q-scroll-graphic-content {
    width: 100%;
    background-color: rgba(255, 255, 255, 0.95);
    box-shadow: none;

    padding-top: 17px;
    padding-bottom: 23px;
    line-height: 26px;
  }

  .q-scroll-graphic-content--large {
    max-width: 400px;
    padding-left: 20px;
    padding-right: 20px;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
    text-align: center;
  }

  .q-scroll-graphic-spacer {
    height: 80vh;
  }

  .q-scroll-graphic-content :global(b) {
    font-weight: 100;
    color: #fff;
    background: #05032d;
    border-radius: 2px;
    padding: 0px 4px;
  }
</style>
