const Joi = require("joi");
const Validation = require("@nzz/et-utils-validation");

module.exports = {
  method: "POST",
  path: "/notification/{optionName}",
  options: {
    validate: {
      payload: Joi.object(),
    },
  },
  handler: function (request, h) {
    try {
      let customized;

      if (request.payload.item && request.payload.item.sectionText) {
        customized = request.payload.item.sectionText.customized;
      }

      if (
        !!customized &&
        !Validation.isRgbaString(customized.textBackgroundColor)
      )
        return {
          message: {
            title: "notification.shouldBeRgba.title",
            body: "notification.shouldBeRgba.body",
          },
        };

      return null;
    } catch (error) {
      return null;
    }
  },
};
