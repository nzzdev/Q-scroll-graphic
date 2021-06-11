<script>
  import { TinyColor } from "@ctrl/tinycolor";
  export let maxHeight;
  export let variant;
  export let text;

  function parseHightlightedText(text) {
    // matches text block in the form of [text](backgroundColor)
    const regex = /\[(?<text>[^\]]+)\]\((?<backgroundColor>[^\)]+)\)/g;
    return text.replace(regex, (match, text, backgroundColor) => {
      backgroundColor = new TinyColor(backgroundColor);
      let textColor = "#ffffff";
      if (backgroundColor.isValid) {
        textColor = backgroundColor.isLight() ? "#000000" : "#ffffff";
      }
      return `<span class="q-scroll-graphic-content--hightlighted" style="background-color: ${backgroundColor.toString()}; color: ${textColor};">${text}</span>`;
    });
  }
</script>

<section>
  <div class="q-scroll-graphic-text-box">
    <p
      class="s-font-text-s q-scroll-graphic-content q-scroll-graphic-content--{variant}"
    >
      {@html parseHightlightedText(text)}
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

  .q-scroll-graphic-content :global(.q-scroll-graphic-content--hightlighted) {
    font-weight: 100;
    border-radius: 2px;
    padding: 0px 4px;
  }

  .q-scroll-graphic-spacer {
    height: 80vh;
  }
</style>
