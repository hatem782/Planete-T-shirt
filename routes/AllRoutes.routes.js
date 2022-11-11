const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user.controller");
const ArticleController = require("../controllers/article.controller");
const PanierController = require("../controllers/panier.controller");
const BoutiqueController = require("../controllers/boutique.controller");

//------------------------------------------------------------------
//---------------------------USER ROUTES----------------------------
router.get("/connection", (req, res, next) => {
  const login_error = req.session?.context?.login_error || "";
  const register_error = req.session?.context?.register_error || "";
  res.render("connection", { login_error, register_error });
});
router.post("/login", UserController.Login);

router.post("/register", UserController.Register);

router.get("/deconnection", UserController.Deconnection);

router.get("/reinitialisation", (req, res, next) => {
  res.render("ForgetPassword");
});

router.post("/reset_password", UserController.ResetPassword);

router.get("/profile", UserController.GetProfile);

//------------------------------------------------------------------
//-----------------------------Articles-----------------------------

router.get("/article/getall", ArticleController.AllArticles);
router.post("/article/add", ArticleController.AddArticle);
router.put("/article/update/:_id", ArticleController.UpdateArticle);
router.delete("/article/remove/:_id", ArticleController.DeleteArticle);

router.get("/catalogue", ArticleController.CataloguePage);
router.get("/article/one/:_id", ArticleController.OneArticlePage);
//------------------------------------------------------------------
//------------------------------PANIER------------------------------

router.post(
  "/ajouter_au_panier/:_id",
  PanierController.AddArticleToCurrentPanier
);

router.get("/panier", PanierController.ShowPanierPage);

router.get("/panier/delete_order/:_id", PanierController.DeleteOrderFromPanier);

router.post("/panier/validate", PanierController.ValidatePanier);

router.get("/panier/historique", PanierController.ShowOldPaniersPage);

//------------------------------------------------------------------
//---------------------------Boutiques------------------------------

router.get("/boutique/getall", BoutiqueController.AllBoutiques);
router.post("/boutique/add", BoutiqueController.AddBoutique);
router.put("/boutique/update/:_id", BoutiqueController.UpdateBoutique);
router.delete("/boutique/remove/:_id", BoutiqueController.DeleteBoutique);

router.get("/boutiques", BoutiqueController.BoutiquesPage);
router.get("/boutique/one/:_id", BoutiqueController.OneBoutiquePage);

//------------------------------------------------------------------
//------------------------------PAGES-------------------------------

router.get("/acceuil", (req, res, next) => {
  const user = req.session?.context?.user || null;
  res.render("Acceuil", { user });
});

router.get("/404", (req, res, next) => {
  res.render("error404");
});

router.get("/test", (req, res, next) => {
  res.render("test", { title: "hello i am hatem" });
});

//------------------------------------------------------------------
//--------------------------Dashboard-------------------------------

router.get("/dashboard", (req, res, next) => {
  const user = req.session?.context?.user || null;
  if (!user || user?.role !== "admin") {
    return res.redirect("/acceuil");
  }
  // if (user?.role === "admin") {
  res.render("dashboard/dash_main", { user });
  // } else {
  // res.redirect("/acceuil");
  // }
});

router.get("/gest_articles", ArticleController.ShowArticles);
router.get("/article/delete/:_id", ArticleController.DeleteArticleDash);

router.get("/article/createpage", (req, res) => {
  const user = req.session?.context?.user || null;
  if (!user || user?.role !== "admin") {
    return res.redirect("/acceuil");
  }
  res.render("dashboard/addarticle", { user });
});

router.post("/article/create", ArticleController.CreateArticle);
router.get("/article/updatepage/:_id", ArticleController.UpdateArticlePage);
router.post("/article/update/:_id", ArticleController.UpdateArticleFunction);

router.get("/gest_boutiques", BoutiqueController.ShowBoutiques);
router.get("/boutique/delete/:_id", BoutiqueController.DeleteBoutiqueDash);

router.get("/boutique/createpage", (req, res) => {
  const user = req.session?.context?.user || null;
  if (!user || user?.role !== "admin") {
    return res.redirect("/acceuil");
  }
  res.render("dashboard/addboutique", { user });
});

router.post("/boutique/create", BoutiqueController.CreateBoutique);
router.get("/boutique/updatepage/:_id", BoutiqueController.UpdateBoutiquePage);
router.post("/boutique/update/:_id", BoutiqueController.UpdateBoutiqueFunction);

module.exports = router;
