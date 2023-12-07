const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ******************************************
 * Deliver Account Management view
 *******************************************/
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/accountManagement", {
    title: "Account Management",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      return res.redirect("/account/");
    }
  } catch (error) {
    return new Error("Access Forbidden");
  }
}

/* ****************************************
 *  Deliver Update Account view
 * *************************************** */
async function buildAccountUpdateView(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/update", {
    title: "Edit Account",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Update Account view
 * *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email } = req.body;
  const account_id = res.locals.accountData.account_id;
  const updResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  );
  console.log(updResult);
  if (updResult) {
    const accessToken = jwt.sign(updResult, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: 3600 * 1000,
    });
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
    req.flash("notice", `Congratulations, the update was successful.`);
    res.redirect("/account/");
    /* res.status(201).render("account/accountManagement", {
      title: "Account Management",
      nav,
    });*/
  } else {
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("/account/", {
      title: "Edit Account",
      nav,
    });
  }
}

/* ****************************************
 *  Update Password view
 * *************************************** */
async function updatePassword(req, res) {
  let nav = await utilities.getNav();
  const { account_password } = req.body;
  const account_id = res.locals.accountData.account_id;
  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, the processing for updating the password failed."
    );
  }

  const passResult = await accountModel.updatePassword(
    hashedPassword,
    account_id
  );
  console.log("passResult: " + passResult);
  if (passResult) {
    const accessToken = jwt.sign(passResult, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: 3600 * 1000,
    });
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
    req.flash("notice", `Congratulations, your password was updated.`);
    res.redirect("/account/");
    /* res.status(201).render("account/accountManagement", {
      title: "Account Management",
      nav,
      updateAccount,
    });*/
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("/account/", {
      title: "Edit Account",
      nav,
    });
  }
}

/* ****************************************
 *  Logout request
 * ************************************ */
async function accountLogout(req, res) {
  try {
    res.clearCookie("jwt");
    /*req.flash("notice", "You have been logged out.");*/
    res.redirect("/");
  } catch (error) {
    res.redirect("/");
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagement,
  buildAccountUpdateView,
  updateAccount,
  updatePassword,
  accountLogout,
};
