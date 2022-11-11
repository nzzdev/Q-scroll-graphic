const Boom = require("@hapi/boom");
const Joi = require("joi");

module.exports = {
  method: "POST",
  path: "/option-availability/{optionName}",
  options: {
    validate: {
      payload: Joi.object(),
    },
  },
  handler: function (request, h) {
    const item = request.payload.item;

    if (request.params.optionName === "custom-text-section") {
      return {
        available: item.sectionText.sectionTextBackground === "custom",
      };
    }

    return Boom.badRequest();
  },
};
