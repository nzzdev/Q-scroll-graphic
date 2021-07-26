<script>
  import { TinyColor } from "@ctrl/tinycolor";
  export let maxHeight;
  export let variant;
  export let step;

  function getHighlightedText(step) {
    for (let highlightText of step.highlightTexts) {
      let textReplacement = "";
      let text = highlightText.text;

      if (highlightText.preventBreakingToNextLine) {
        text = text.replace(/ /g, "&nbsp;");
      }

      if (highlightText.type === "background") {
        const backgroundColor = new TinyColor(highlightText.color);
        let textColor = "#ffffff";
        if (backgroundColor.isValid) {
          textColor = backgroundColor.isLight() ? "#000000" : "#ffffff";
        }
        textReplacement = `<span class="q-scroll-graphic-content--background" style="background-color: ${backgroundColor.toString()}; color: ${textColor};">${text}</span>`;
      } else if (highlightText.type === "underline") {
        textReplacement = `<u class="q-scroll-graphic-content--underline" style="text-decoration-color: ${highlightText.color};">${text}</u>`;
      } else if (highlightText.type === "bold") {
        textReplacement = `<b style="color: ${highlightText.color}">${text}</b>`;
      }

      step.text = step.text.replace(highlightText.text, textReplacement);
    }

    return step.text;
  }
</script>

<section>
  <div class="q-scroll-graphic-text-box">
    <p
      class="s-font-text-s q-scroll-graphic-content q-scroll-graphic-content--{variant}"
    >
      {#if step.text && step.text !== ""}
        {#if step.highlightTexts && step.highlightTexts.length > 0}
          {@html getHighlightedText(step)}
        {:else}
          {step.text}
        {/if}
      {/if}
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

  :global(.q-scroll-graphic-content--background) {
    font-weight: 100;
    border-radius: 2px;
    padding: 0px 4px;
  }

  :global(.q-scroll-graphic-content--underline) {
    text-underline-offset: 0.1em;
    text-decoration-line: underline;
    text-decoration-style: solid;
    text-decoration-thickness: 2px;
  }

  .q-scroll-graphic-spacer {
    height: 80vh;
  }
</style>
