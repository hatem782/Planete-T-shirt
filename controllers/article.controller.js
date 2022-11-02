const ArticleModel = require("../models/Article.schema");

const AddArticle = async (req, res) => {
  try {
    const { libelle, image, description, price } = req.body;
    console.log({ libelle, image, description, price });
    //--------------------------------------------------------------------------
    // verifier si l'article existe deja
    let existArticle = await ArticleModel.findOne({ libelle });
    if (existArticle) {
      return res.status(400).json({
        Message: "produit deja exist",
        Success: false,
      });
    }

    const article = new ArticleModel({
      libelle,
      image,
      description,
      price,
    });
    const newArticle = await article.save();

    if (!newArticle) {
      return res.status(400).json({
        Message: "problem dans l'ajout de l'article",
        Success: false,
      });
    }

    return res.status(200).json({
      Message: "aricle a été ajouté",
      Success: true,
    });
  } catch (error) {
    console.log("##########:", error);
    return res.status(400).json({
      Message: "problem dans l'ajout de l'article",
      Success: false,
    });
  }
};

const AllArticles = async (req, res) => {
  try {
    const articles = await ArticleModel.find();
    return res.status(200).json({
      Message: "tous articles",
      Success: true,
      data: { articles },
    });
  } catch (error) {
    console.log("##########:", error);
    res.status(400).send({ Message: "Server Error", Error: error.message });
  }
};

const UpdateArticle = async (req, res) => {
  try {
    const { _id } = req.params;
    const { libelle, image, description, price } = req.body;
    console.log({ libelle, image, description, price });
    //--------------------------------------------------------------------------
    let updatedArticle = await ArticleModel.findOneAndUpdate(
      { _id },
      { libelle, image, description, price },
      { new: true }
    );

    if (!updatedArticle) {
      return res.status(400).json({
        Message: "problem dans la modification de l'article",
        Success: false,
      });
    }

    return res.status(200).json({
      Message: "aricle a été modifié",
      Success: true,
    });
  } catch (error) {
    console.log("##########:", error);
    return res.status(400).json({
      Message: "problem dans la modification de l'article",
      Success: false,
    });
  }
};

const DeleteArticle = async (req, res) => {
  try {
    const { _id } = req.query;
    const removedArticle = await ArticleModel.remove({ _id });
    if (!removedArticle) {
      return res
        .status(400)
        .json({ Message: "Probléme dans la suppression de l'article" });
    }
    return res.status(200).json({ Message: "Article a été supprimé" });
  } catch (error) {
    console.log("##########:", error);
    res.status(500).send({ Message: "Server Error", Error: error.message });
  }
};

const CataloguePage = async (req, res) => {
  try {
    const articles = await ArticleModel.find();

    return res.render("catalogue", { articles: articles });
  } catch (error) {
    console.log("##########:", error);
    res.status(400).send({ Message: "Server Error", Error: error.message });
  }
};

module.exports = {
  AddArticle,
  AllArticles,
  UpdateArticle,
  DeleteArticle,
  CataloguePage,
};
