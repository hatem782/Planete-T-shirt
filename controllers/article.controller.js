const ArticleModel = require("../models/Article.schema");

const AddArticle = async (req, res) => {
  try {
    const { libelle, image, description, price } = req.body;
    //--------------------------------------------------------------------------
    // verifier si l'article existe deja
    let existArticle = await ArticleModel.findOne({ libelle });
    if (existArticle) {
      res.status(400);
      res.send({
        Message: "produit deja exist",
        Success: false,
      });
      return res;
    }

    const article = new ArticleModel({
      libelle,
      image,
      description,
      price,
    });
    const newArticle = await article.save();

    if (!newArticle) {
      res.status(400);
      res.send({
        Message: "problem dans l'ajout de l'article",
        Success: false,
      });
      return res;
    }

    res.status(200);
    res.send({
      Message: "aricle a été ajouté",
      Success: true,
    });
    return res;
  } catch (error) {
    console.log("##########:", error);
    res.status(400);
    res.send({
      Message: "problem dans l'ajout de l'article",
      Success: false,
    });
    return res;
  }
};

const AllArticles = async (req, res) => {
  try {
    const articles = await ArticleModel.find();
    res.status(200);
    res.send({
      Message: "tous articles",
      Success: true,
      data: { articles },
    });
    return res;
  } catch (error) {
    console.log("##########:", error);
    res.status(400);
    res.send({ Message: "Server Error", Error: error.message });
    return res;
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
      res.status(400);
      res.send({
        Message: "problem dans la modification de l'article",
        Success: false,
      });
      return res;
    }

    res.status(200);
    res.send({
      Message: "aricle a été modifié",
      Success: true,
      updated: updatedArticle,
    });
    return res;
  } catch (error) {
    console.log("##########:", error);
    res.status(400);
    res.send({
      Message: "problem dans la modification de l'article",
      Success: false,
    });
    return res;
  }
};

const DeleteArticle = async (req, res) => {
  try {
    const { _id } = req.params;
    const removedArticle = await ArticleModel.findByIdAndDelete({ _id });
    if (!removedArticle) {
      res.status(400);
      res.send({ Message: "Probléme dans la suppression de l'article" });
      return res;
    }
    res.status(200);
    res.send({ Message: "Article a été supprimé" });
    return res;
  } catch (error) {
    console.log("##########:", error);
    res.status(500);
    res.send({ Message: "Server Error", Error: error.message });
    return res;
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
