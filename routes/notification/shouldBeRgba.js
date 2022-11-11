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
      let customTextSection;

      if (request.payload.item && request.payload.item.textSection) {
        customTextSection = request.payload.item.textSection.customTextSection;
      }

      if (
        !!customTextSection &&
        !Validation.isRgbaString(customTextSection.textBackgroundColor)
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
