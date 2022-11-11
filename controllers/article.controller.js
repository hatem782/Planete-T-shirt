const ArticleModel = require("../models/Article.schema");

const AddArticle = async (req, res) => {
  try {
    const { libelle, image, description, price } = req.body;
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
    const removedArticle = await ArticleModel.findByIdAndDelete({ _id });
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
  const user = req.session?.context?.user || null;
  try {
    const articles = await ArticleModel.find({ deleted: false });

    if (articles?.length === 0 || !articles) {
      return res.render("catalogue", {
        articles: [],
        user: user,
        articles_error: "il n'y a pas d'articles",
      });
    }

    return res.render("catalogue", {
      articles: articles,
      articles_error: "",
      user: user,
    });
  } catch (error) {
    console.log("##########:", error);
    res.status(400).send({ Message: "Server Error", Error: error.message });
  }
};

const OneArticlePage = async (req, res) => {
  const { _id } = req.params;
  const article_error = req?.session?.context?.article_error || "";
  const user = req.session?.context?.user || null;
  try {
    const article = await ArticleModel.findOne({ _id });
    if (!article) {
      return res.render("article", {
        article: article,
        user: user,
        article_error: "article n'est pas exist",
      });
    }
    return res.render("article", {
      article: article,
      user: user,
      article_error: article_error,
    });
  } catch (error) {
    console.log("##########:", error);
    return res.render("article", {
      article: {},
      user: user,
      article_error: "article n'est pas exist",
    });
  }
};

const ShowArticles = async (req, res) => {
  const user = req.session?.context?.user || null;
  if (!user || user?.role !== "admin") {
    return res.redirect("/acceuil");
  }

  try {
    const articles = await ArticleModel.find({ deleted: false });
    const user = req.session?.context?.user || null;
    return res.render("dashboard/showarticle", { articles, user });
  } catch (error) {
    console.log("##########:", error);
    res.status(400).send({ Message: "Server Error", Error: error.message });
  }
};

const CreateArticle = async (req, res) => {
  const user = req.session?.context?.user || null;
  if (!user || user?.role !== "admin") {
    return res.redirect("/acceuil");
  }

  try {
    const { libelle, image, description, price } = req.body;
    //--------------------------------------------------------------------------
    // verifier si l'article existe deja
    let existArticle = await ArticleModel.findOne({ libelle });
    if (existArticle) {
      return res.redirect("/article/createpage");
    }

    const article = new ArticleModel({
      libelle,
      image,
      description,
      price,
    });
    const newArticle = await article.save();

    if (!newArticle) {
      return res.redirect("/article/createpage");
    }

    return res.redirect("/gest_articles");
  } catch (error) {
    console.log("##########:", error);
    return res.status(400).json({
      Message: "problem dans l'ajout de l'article",
      Success: false,
    });
  }
};

const UpdateArticlePage = async (req, res) => {
  const user = req.session?.context?.user || null;
  if (!user || user?.role !== "admin") {
    return res.redirect("/acceuil");
  }

  try {
    const { _id } = req.params;
    const articleToUpdate = await ArticleModel.findById({ _id });
    if (!articleToUpdate) {
      return res.redirect("/gest_articles");
    }
    return res.render("dashboard/updatearticle", {
      article: articleToUpdate,
      user: user,
    });
  } catch (error) {
    console.log("##########:", error);
    res.status(500).send({ Message: "Server Error", Error: error.message });
  }
};

const UpdateArticleFunction = async (req, res) => {
  const user = req.session?.context?.user || null;
  if (!user || user?.role !== "admin") {
    return res.redirect("/acceuil");
  }

  try {
    const { _id } = req.params;
    const { libelle, image, description, price } = req.body;

    const updatedArticle = await ArticleModel.findOneAndUpdate(
      { _id },
      {
        libelle,
        image,
        description,
        price,
      }
    );

    if (!updatedArticle) {
      return res.redirect("/article/updatepage/" + _id);
    }

    return res.redirect("/gest_articles");
  } catch (error) {
    console.log("##########:", error);
    return res.status(400).json({
      Message: "problem dans l'ajout de l'article",
      Success: false,
    });
  }
};

const DeleteArticleDash = async (req, res) => {
  const user = req.session?.context?.user || null;
  if (!user || user?.role !== "admin") {
    return res.redirect("/acceuil");
  }

  try {
    const { _id } = req.params;
    const removedArticle = await ArticleModel.findOneAndUpdate(
      { _id },
      { deleted: true }
    );
    if (!removedArticle) {
      return res.redirect("/gest_articles");
    }
    return res.redirect("/gest_articles");
  } catch (error) {
    console.log("##########:", error);
    res.status(500).send({ Message: "Server Error", Error: error.message });
  }
};

module.exports = {
  AddArticle,
  AllArticles,
  UpdateArticle,
  DeleteArticle,
  CataloguePage,
  OneArticlePage,
  ShowArticles,
  CreateArticle,
  DeleteArticleDash,
  UpdateArticlePage,
  UpdateArticleFunction,
};
