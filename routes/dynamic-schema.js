const Boom = require("@hapi/boom");
const Joi = require("joi");

module.exports = {
  method: "POST",
  path: "/dynamic-schema/{optionName}",
  options: {
    validate: {
      payload: Joi.object(),
    },
    cors: true,
  },
  handler: async function (request, h) {
    const item = request.payload.item;
    const optionName = request.params.optionName;

    if (optionName === "highlightedTextColors") {
      return {
        enum: item.highlightedTextColors.map(
          (highlightedTextColor, index) => index
        ),
        "Q:options": {
          enum_titles: item.highlightedTextColors.map(
            (highlightedTextColor) => highlightedTextColor.color
          ),
        },
      };
    }

    return Boom.badRequest();
  },
};
