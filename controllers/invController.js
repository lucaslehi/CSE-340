const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  });
};

/* *****************************
 * Build Detailed view
 * ***************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const invId = req.params.inventoryId;
  const vehicleData = await invModel.getVehicleByInventoryId(invId);
  const detail = await utilities.buildDetailView(vehicleData);
  let nav = await utilities.getNav();
  const vehicleYear = vehicleData[0].inv_year;
  const vehicleMake = vehicleData[0].inv_make;
  const vehicleModel = vehicleData[0].inv_model;
  res.render("./inventory/detail", {
    title: vehicleYear + " " + vehicleMake + " " + vehicleModel,
    nav,
    detail,
    errors: null,
  });
};

/* ***************************
 *  Build Management View
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  });
};

/* ***************************
 *  Add New Classification View
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  });
};

/* ***************************
 *  Add New Inventory View
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let options = await utilities.buildClassificationOptions();
  res.render("./inventory/add-inventory", {
    title: "Add New inventory",
    nav,
    options,
    errors: null,
  });
};

/* ****************************************
 *  Add New Classification
 * ************************************ */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;
  const classificationResult = await invModel.addClassification(
    classification_name
  );

  if (classificationResult) {
    nav = await utilities.getNav();
    req.flash("notice", `The ${classification_name} was successfully added.`);
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the add a new classification failed.");
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
    });
  }
};

/* ****************************************
 *  Add New Inventory
 * ************************************ */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav();
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
  const inventoryResult = await invModel.addInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  );

  if (inventoryResult) {
    req.flash("notice", `The ${inv_make} ${inv_model} was successfully added.`);
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the add a new vehicle failed.");
    res.status(501).render("inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
    });
  }
};
module.exports = invCont;
