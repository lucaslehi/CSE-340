const utilities = require(".");
const invModel = require("../models/inventory-model");
const { body, validationResult } = require("express-validator");
const validate = {};

/*  **********************************
 *  New classification data validation rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage("Please provide a correct classification name.")
      .custom(async (classification_name) => {
        const classificationExists = await invModel.checkExistingClassification(
          classification_name
        );
        if (classificationExists) {
          throw new Error(
            "Classification exists. Please try using a different name."
          );
        }
      }),
  ];
};

/*  **********************************
 *  New Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .isLength({ min: 1 })
      .notEmpty()
      .withMessage("Please provide a classification name."),
    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a make."),
    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a model."),
    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a description."),
    body("inv_image")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a image."),
    body("inv_thumbnail")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a thumbnail."),
    body("inv_price")
      .trim()
      .isLength({ min: 2 })
      .isNumeric()
      .withMessage("Please provide a price."),
    body("inv_year")
      .trim()
      .isLength({ min: 4, max: 4 })
      .isNumeric()
      .withMessage("Please provide a year."),
    body("inv_miles")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide the miles."),
    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a color."),
  ];
};

/* ******************************
 * Check data and add classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

validate.checkInventoryData = async (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body;
  let options = await utilities.buildClassificationOptions(classification_id);
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      options,
      nav,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    });
    return;
  }
  next();
};

module.exports = validate;
