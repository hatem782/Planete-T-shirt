const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user.controller");

//------------------------------------------------------------------
//---------------------------USER ROUTES----------------------------
router.get("/connection", (req, res, next) => {
  const login_error = req.session?.context?.login_error || "";
  const register_error = req.session?.context?.register_error || "";
  console.log({ login_error, register_error });
  res.render("connection", { login_error, register_error });
});
router.post("/login", UserController.Login);

router.post("/register", UserController.Register);

router.get("/deconnection", UserController.Deconnection);

//------------------------------------------------------------------
//-----------------------------Acceuil------------------------------

router.get("/acceuil", (req, res, next) => {
  const user = req.session?.context?.user || null;
  console.log(user);
  res.render("Acceuil", { user });
});

router.get("/catalogue", (req, res, next) => {
  res.render("catalogue");
});

router.get("/panier", (req, res, next) => {
  res.render("panier");
});

router.get("/boutiques", (req, res, next) => {
  res.render("boutiques");
});

router.get("/404", (req, res, next) => {
  res.render("error404");
});

router.get("/test", (req, res, next) => {
  res.render("test", { title: "hello i am hatem" });
});

module.exports = router;
