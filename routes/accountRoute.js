const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);
router.get("/logout", utilities.handleErrors(accountController.accountLogout));

// Preocess registration attempt
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Process the account update
router.post("/update", utilities.handleErrors(accountController.updateAccount));

// Process the password update
router.post(
  "/update-password",
  utilities.handleErrors(accountController.updatePassword)
);

// Deliver Account Management View
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
);

// Deliver Account Update View
router.get(
  "/update/:account_id",
  utilities.handleErrors(accountController.buildAccountUpdateView)
);

module.exports = router;
