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
      const custom = request.payload.item?.sectionText?.custom;

      if (!Validation.isRgbaString(custom?.textBackgroundColor))
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
