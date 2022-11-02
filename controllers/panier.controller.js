const PannierModel = require("../models/Pannier.schema");
const OrderModel = require("../models/order.schema");
const ArticleModel = require("../models/Article.schema");

const AddArticleToCurrentPanier = async (req, res) => {
  // getting id of tshirt
  const { _id } = req.params;
  // getting id of tshirt
  const { size } = req.body;

  try {
    const user = req.session?.context?.user || null;
    // il n'y a pas d'utilisateur , pas des session
    if (!user) {
      req.session.context = {
        ...req.session.context,
        login_error: "tu dois connecter pour ajouter cet produit",
      };
      return res.redirect("/connection");
    }

    const existArticle = await ArticleModel.findOne({ _id });

    if (!existArticle) {
      req.session.context = {
        ...req.session.context,
        article_error: "cet article n'est pas exist",
      };
      return res.redirect("/article/one/" + _id);
    }

    const UnapprovedPanier = await PannierModel.findOne({
      idUser: user._id,
      approved: false,
    });

    const order = new OrderModel({
      idProd: _id,
      idPanier: UnapprovedPanier._id,
      idUser: user._id,
      size: size,
      quantity: 1,
      date: new Date(),
    });

    const newOrder = await order.save();

    const updatedPanier = await PannierModel.findOneAndUpdate(
      { _id: UnapprovedPanier._id },
      { $inc: { totalprice: existArticle.price } }
    );

    if (!updatedPanier || !newOrder) {
      req.session.context = {
        ...req.session.context,
        article_error:
          "il y'a un erreur dans l'ajout de cet produit à tom panier",
      };
      return res.redirect("/article/one/" + _id);
    }

    req.session.context = {
      ...req.session.context,
      panier: "tout est bien",
      article_error: "",
    };
    return res.redirect("/panier");
  } catch (error) {
    console.log("##########:", error);
    req.session.context = {
      ...req.session.context,
      article_error:
        "il y'a un erreur dans l'ajout de cet produit à tom panier",
    };
    return res.redirect("/article/one/" + _id);
  }
};

const ShowPanierPage = async (req, res) => {
  try {
    const user = req.session?.context?.user || null;
    // il n'y a pas d'utilisateur , pas des session
    if (!user) {
      req.session.context = {
        ...req.session.context,
        login_error: "tu dois connecter pour accéder à votre panier",
      };
      return res.redirect("/connection");
    }

    const panier = await PannierModel.findOne({
      idUser: user._id,
      approved: false,
    });

    if (!panier) {
      return res.render("panier", {
        panier: null,
        panier_error: "panier n'est pas exist",
      });
    }

    const orders = await OrderModel.find({ idPanier: panier._id }).populate(
      "idProd"
    );

    return res.render("panier", {
      panier: panier,
      orders: orders,
      panier_error: "",
    });
  } catch (error) {
    console.log("##########:", error);
    return res.render("panier", {
      panier: null,
      panier_error: "panier n'est pas exist",
    });
  }
};

const DeleteOrderFromPanier = async (req, res) => {
  // getting id of tshirt
  try {
    const { _id } = req.params;
    console.log(_id);
    const deletedOrder = await OrderModel.findOneAndDelete({ _id });
    if (!deletedOrder) {
      console.log("we have to do something here ...");
      return res.redirect("/panier");
    }

    const relatedArticle = await ArticleModel.findOne({
      _id: deletedOrder.idProd,
    });
    if (!relatedArticle) {
      console.log("we have to do something here ...");
      return res.redirect("/panier");
    }

    const updatedPanier = await PannierModel.findOneAndUpdate(
      { _id: deletedOrder.idPanier },
      { $inc: { totalprice: -relatedArticle.price } }
    );
    if (!updatedPanier) {
      console.log("we have to do something here ...");
      return res.redirect("/panier");
    }

    return res.redirect("/panier");
  } catch (error) {
    console.log("##########:", error);
    return res.render("panier", {
      panier: null,
      panier_error: "panier n'est pas exist",
    });
  }
};

module.exports = {
  AddArticleToCurrentPanier,
  ShowPanierPage,
  DeleteOrderFromPanier,
};
