const Boom = require("@hapi/boom");
const fs = require("fs");
const path = require("path");

const stylesDir = path.join(__dirname, "/../../styles/");
const styleHashMap = require(path.join(stylesDir, "hashMap.json"));
const scriptsDir = "../../scripts/";
const scriptHashMap = require(`${scriptsDir}/hashMap.json`);

// setup svelte
const viewsDir = `${__dirname}/../../views/`;
require("svelte/register");
const staticTemplate = require(viewsDir + "App.svelte").default;

// POSTed item will be validated against given schema
// hence we fetch the JSON schema...
const schemaString = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../../resources/", "schema.json"), {
    encoding: "utf-8",
  })
);
const Ajv = require("ajv");
const ajv = new Ajv();

const validate = ajv.compile(schemaString);
function validateAgainstSchema(item, options) {
  if (validate(item)) {
    return item;
  } else {
    throw Boom.badRequest(JSON.stringify(validate.errors));
  }
}

async function validatePayload(payload, options, next) {
  if (typeof payload !== "object") {
    return next(Boom.badRequest(), payload);
  }
  if (typeof payload.item !== "object") {
    return next(Boom.badRequest(), payload);
  }
  if (typeof payload.toolRuntimeConfig !== "object") {
    return next(Boom.badRequest(), payload);
  }
  await validateAgainstSchema(payload.item, options);
}

module.exports = {
  method: "POST",
  path: "/rendering-info/web",
  options: {
    validate: {
      options: {
        allowUnknown: true,
      },
      payload: validatePayload,
    },
  },
  handler: async function (request, h) {
    const item = request.payload.item;
    const toolRuntimeConfig = request.payload.toolRuntimeConfig;

    const context = {
      id: `q_scroll_graphic_${toolRuntimeConfig.requestId}`,
      displayOptions: request.payload.toolRuntimeConfig.displayOptions || {},
      item: item,
    };

    const staticTemplateRender = staticTemplate.render(context);
    const renderingInfo = {
      polyfills: [
        "fetch",
        "Promise",
        "Element.prototype.classList",
        "CustomEvent",
      ],
      stylesheets: [
        {
          content: staticTemplateRender.css.code,
        },
        {
          name: styleHashMap["default"],
        },
      ],
      scripts: [
        {
          name: scriptHashMap["default"],
        },
        {
          content: `
          (function () {
            var target = document.querySelector('#${context.id}_container');
            target.innerHTML = "";
            var props = JSON.parse('${JSON.stringify(context)}');
            new window._q_scroll_graphic.ScrollGraphic({
              "target": target,
              "props": props
            })
          })();`,
        },
      ],
      markup: staticTemplateRender.html,
    };

    return renderingInfo;
  },
};
