const { body, param, query } = require("express-validator");

let addUnitValidations = [
  body("estateType")
    .isAlpha()
    .withMessage("EstateType Must Be Characters Only")
    .isIn(["studio", "shared-room", "single-room", "apartment"])
    .withMessage(
      "EstateType Must Be (Studio||Shared-Room||Single-Room||Apartment)"
    ),

  body("address").isObject().withMessage("Unit Address should be object "),
  body("address.city").isAlpha().withMessage("Unit City should be characters"),

  body("address.streetName").optional().isAlpha().withMessage("Unit Street "),

  body("address.buildingNumber")
    .optional()
    .isNumeric()
    .withMessage("Unit Building Number should be number"),

  body("dailyPrice").isNumeric().withMessage("Unit Daily Price Must Be Number"),
  body(" isAvailable")
    .isBoolean()
    .withMessage(
      "Unit Availability Must Be Added as true(available), false(unavailable)"
    ),
];

let updateUnitValidations = [
  // body("estateType")
  //   .isAlphanumeric()
  //   .withMessage("EstateType Must Be Characters and can contain - ")
  //   .isIn(["studio", "sharedRoom", "singleRoom", "apartment"])
  //   .withMessage(
  //     "EstateType Must Be (studio||sharedRoom||singleRoom||apartment)"
  //   )
  //   .optional(),

  body("address")
    .isObject()
    .withMessage("Unit Address should be object ")
    .optional(),
  body("address.city")
    .isAlpha()
    .withMessage("Unit City should be characters")
    .optional(),

  body("address.streetName").optional().isAlpha().withMessage("Unit Street "),

  body("address.buildingNumber")
    .optional()
    .isNumeric()
    .withMessage("Unit Building Number should be number"),

  body("dailyPrice")
    .isNumeric()
    .withMessage("Unit Daily Price Must Be Number")
    .optional(),
  body("isAvailable")
    .isBoolean()
    .withMessage(
      "Unit Availability Must Be Added as true(available), false(unavailable)"
    )
    .optional(),
];

module.exports = {
  addUnitValidations,
  updateUnitValidations,
};
