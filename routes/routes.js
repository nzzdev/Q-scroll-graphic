module.exports = [
  require("./rendering-info/web.js"),
  require("./stylesheet.js"),
  require("./script.js"),
  require("./health.js"),
  require("./fixtures/data.js"),
  require("./locales.js"),
  require("./dynamic-schema.js"),
  require("./option-availability.js"),
  require("./notification/shouldBeRgba.js"),
].concat(require("./schema.js"));
