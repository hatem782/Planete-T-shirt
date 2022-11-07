const PannierModel = require("../models/Pannier.schema");
const OrderModel = require("../models/order.schema");
const ArticleModel = require("../models/Article.schema");
const BoutiqueModel = require("../models/boutique.schema");

const AddArticleToCurrentPanier = async (req, res) => {
  // getting id of article
  const { _id } = req.params;
  // getting size of article
  const { size } = req.body;

  const user = req.session?.context?.user || null;
  try {
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
          "il y'a un erreur dans l'ajout de cet produit à ton panier",
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
  const user = req.session?.context?.user || null;
  try {
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
        user: user,
        panier_error: "panier n'est pas exist",
      });
    }

    const orders = await OrderModel.find({ idPanier: panier._id }).populate(
      "idProd"
    );
    const boutiques = await BoutiqueModel.find();

    return res.render("panier", {
      panier: panier,
      orders: orders,
      user: user,
      boutiques: boutiques,
      panier_error: "",
    });
  } catch (error) {
    console.log("##########:", error);
    return res.render("panier", {
      panier: null,
      user: user,
      panier_error: "panier n'est pas exist",
    });
  }
};

const ShowOldPaniersPage = async (req, res) => {
  const user = req.session?.context?.user || null;
  try {
    // il n'y a pas d'utilisateur , pas des session
    if (!user) {
      req.session.context = {
        ...req.session.context,
        login_error: "tu dois connecter pour accéder à votre panier",
      };
      return res.redirect("/connection");
    }

    // get all the old paniers
    const paniers = await PannierModel.find({
      idUser: user._id,
      approved: true,
    }).populate("idBoutique");

    let paniers_with_orders = [];

    for (let i = 0; i < paniers.length; i++) {
      const panier_orders = await OrderModel.find({
        idPanier: paniers[i]._id,
      }).populate("idProd");
      paniers_with_orders.push({ ...paniers[i]._doc, orders: panier_orders });
    }
    console.log(paniers_with_orders);

    return res.render("historique", {
      ancientPaniers: paniers_with_orders,
      panier_error: "",
      user: user,
    });
  } catch (error) {
    console.log("##########:", error);
    return res.redirect("/panier");
  }
};

const DeleteOrderFromPanier = async (req, res) => {
  // getting id of tshirt
  try {
    const { _id } = req.params;
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
      user: user,
      panier_error: "panier n'est pas exist",
    });
  }
};

const ValidatePanier = async (req, res) => {
  try {
    // getting id of boutique
    const { boutique, pick_up_date } = req.body;

    if (!boutique) {
      req.session.context = {
        ...req.session.context,
        panier_error: "Selectionner un boutiique",
      };
      return res.redirect("/panier");
    }

    const user = req.session?.context?.user || null;
    // il n'y a pas d'utilisateur , pas des session
    if (!user) {
      req.session.context = {
        ...req.session.context,
        login_error: "tu dois connecter pour ajouter cet produit",
      };
      return res.redirect("/connection");
    }

    const updatedPanier = await PannierModel.findOneAndUpdate(
      {
        idUser: user._id,
        approved: false,
      },
      {
        approved: true,
        idBoutique: boutique,
        pick_up_date: pick_up_date,
      }
    );

    if (!updatedPanier) {
      req.session.context = {
        ...req.session.context,
        panier_error: "il y'a un erreur dans la validation de ton panier",
      };
      return res.redirect("/panier");
    }

    const panier = new PannierModel({
      idUser: user._id,
      totalprice: 0,
      approved: false,
    });

    const newpanier = await panier.save();
    console.log(newpanier);

    req.session.context = {
      ...req.session.context,
      panier_error: "",
    };
    return res.redirect("/panier/historique");
  } catch (error) {
    console.log("##########:", error);
    req.session.context = {
      ...req.session.context,
      panier_error: "il y'a un erreur dans la validation de ton panier",
    };
    return res.redirect("/panier");
  }
};

module.exports = {
  AddArticleToCurrentPanier,
  ShowPanierPage,
  DeleteOrderFromPanier,
  ValidatePanier,
  ShowOldPaniersPage,
};
