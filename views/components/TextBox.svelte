<script>
  import { TinyColor } from "@ctrl/tinycolor";
  import { isRgbaString } from "@nzz/et-utils-validation";

  export let item;
  export let maxHeight;
  export let variant;
  export let step;
  const TEXT_COLOR = Object.freeze({
    white: "#ffffff",
    black: "#000000",
  });
  const BACKGROUND = Object.freeze({
    white: "rgba(255, 255, 255, 0.9)",
    transparent: "rgba(0, 0, 0, 0)",
  });
  const BOX_SHADOW = Object.freeze({
    shadow: "rgba(0, 0, 0, 0.3)",
    none: "none",
  });
  const TEXT_SHADOW = Object.freeze({
    none: "none",
    dark: "0px 0px 8px rgb(0,0,1)",
    light: "0px 0px 8px rgb(255,255,255)",
  });

  function getHighlightedText(step) {
    for (let highlightedText of step.highlightedTexts) {
      if (highlightedText.text && highlightedText.text !== "") {
        let textReplacement = "";
        let text = highlightedText.text;

        if (highlightedText.preventLineBreak) {
          // Prevent line break, by replacing all whitespace characters (including thin spaces)
          text = text.replace(/\s/g, "&nbsp;");
        }

        const highlightedTextColor =
          item.highlightedTextColors[highlightedText.color].color;

        if (highlightedText.type === "background") {
          const backgroundColor = new TinyColor(highlightedTextColor);
          let textColor = TEXT_COLOR.white;
          if (backgroundColor.isValid) {
            textColor = backgroundColor.isLight()
              ? TEXT_COLOR.Black
              : TEXT_COLOR.white;
          }
          textReplacement = `<span class="q-scroll-graphic-content--background" style="background-color: ${backgroundColor.toString()}; color: ${textColor};">${text}</span>`;
        } else if (highlightedText.type === "underline") {
          textReplacement = `<u class="q-scroll-graphic-content--underline" style="text-decoration-color: ${highlightedTextColor};">${text}</u>`;
        } else if (highlightedText.type === "bold") {
          textReplacement = `<b style="color: ${highlightedTextColor}">${text}</b>`;
        }

        step.text = step.text.replace(highlightedText.text, textReplacement);
      }
    }

    return step.text;
  }

  const setSectionTextCSSVars = (step) => {
    let sectionTextOption;
    if (item.textSection && item.textSection.textSectionBackground)
      sectionTextOption = item.textSection.textSectionBackground;
    let backgroundColor = BACKGROUND.white;
    let textColor = TEXT_COLOR.black;
    let textShadow = TEXT_SHADOW.none;
    let boxShadow = BOX_SHADOW.shadow;

    switch (true) {
      case sectionTextOption === "transparentWhite": {
        backgroundColor = BACKGROUND.transparent;
        textColor = TEXT_COLOR.white;
        textShadow = TEXT_SHADOW.dark;
        boxShadow = BOX_SHADOW.none;
        break;
      }
      case sectionTextOption === "transparentBlack": {
        backgroundColor = BACKGROUND.transparent;
        textShadow = TEXT_SHADOW.light;
        boxShadow = BOX_SHADOW.none;
        break;
      }
      case sectionTextOption === "custom": {
        const customOptions = item.sectionText.custom;

        if (!customOptions) break;

        if (
          customOptions.textBackgroundColor &&
          isRgbaString(
            item.sectionText.custom.textBackgroundColor
              .toLowerCase()
              .replace(/ +/g, "")
          )
        )
          backgroundColor = customOptions.textBackgroundColor;

        if (customOptions.textShadow) textShadow = customOptions.textShadow;
        if (customOptions.textColor) textColor = customOptions.textColor;

        const colorParts = backgroundColor.split(",");
        const alpha =
          colorParts.length === 4 ? parseFloat(colorParts[3]) : undefined;
        boxShadow = alpha === 0 ? BOX_SHADOW.none : BOX_SHADOW.shadow;
        break;
      }
    }

    return `--sectionTextBackgroundColor: ${backgroundColor}; --sectionTextColor: ${textColor}; --sectionTextBoxShadow: ${boxShadow}; --sectionTextTextShadow: ${textShadow}`;
  };
</script>

<section>
  <div class="q-scroll-graphic-text-box">
    {#if step.text && step.text !== ""}
      <p
        style={setSectionTextCSSVars(step)}
        class="s-font-text-s q-scroll-graphic-content q-scroll-graphic-content--{variant}"
      >
        {#if step.highlightedTexts && step.highlightedTexts.length > 0}
          {@html getHighlightedText(step)}
        {:else}
          {step.text}
        {/if}
      </p>
    {/if}
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
    /* On Safari the textbox will not fully cover the image without the extra pixel */
    width: calc(100% + 1px);
    background-color: var(--sectionTextBackgroundColor);
    color: var(--sectionTextColor);
    text-shadow: var(--sectionTextTextShadow);
    box-shadow: none;

    padding-top: 17px;
    padding-bottom: 23px;
    line-height: 26px;
  }

  .q-scroll-graphic-content--large {
    max-width: 400px;
    padding-left: 20px;
    padding-right: 20px;
    box-shadow: 1px 1px 5px var(--sectionTextBoxShadow);
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
