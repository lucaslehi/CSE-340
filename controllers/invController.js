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

module.exports = invCont;
