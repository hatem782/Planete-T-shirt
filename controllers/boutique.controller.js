const BoutiqueModel = require("../models/boutique.schema");

const AddBoutique = async (req, res) => {
  try {
    const { libelle, adress, city, telephone, postal_code, description } =
      req.body;
    //--------------------------------------------------------------------------
    // verifier si le boutique existe deja
    let existBoutique = await BoutiqueModel.findOne({ libelle });
    if (existBoutique) {
      return res.status(400).json({
        Message: "boutique deja exist",
        Success: false,
      });
    }

    const boutique = new BoutiqueModel({
      libelle,
      adress,
      city,
      telephone,
      postal_code,
      description,
    });
    const newBoutique = await boutique.save();

    if (!newBoutique) {
      return res.status(400).json({
        Message: "problem dans l'ajout du boutique",
        Success: false,
      });
    }

    return res.status(200).json({
      Message: "boutique a été ajouté",
      Success: true,
    });
  } catch (error) {
    console.log("##########:", error);
    return res.status(400).json({
      Message: "problem dans l'ajout de boutique",
      Success: false,
    });
  }
};

const AllBoutiques = async (req, res) => {
  try {
    const boutiques = await BoutiqueModel.find();
    return res.status(200).json({
      Message: "tous boutiques",
      Success: true,
      data: { boutiques },
    });
  } catch (error) {
    console.log("##########:", error);
    res.status(400).send({ Message: "Server Error", Error: error.message });
  }
};

const UpdateBoutique = async (req, res) => {
  try {
    const { _id } = req.params;
    const { libelle, adress, city, telephone, postal_code, description } =
      req.body;
    //--------------------------------------------------------------------------
    let updatedBoutique = await BoutiqueModel.findOneAndUpdate(
      { _id },
      { libelle, adress, city, telephone, postal_code, description },
      { new: true }
    );

    if (!updatedBoutique) {
      return res.status(400).json({
        Message: "problem dans la modification de le boutique",
        Success: false,
      });
    }

    return res.status(200).json({
      Message: "boutique a été modifié",
      Success: true,
    });
  } catch (error) {
    console.log("##########:", error);
    return res.status(400).json({
      Message: "problem dans la modification de le boutique",
      Success: false,
    });
  }
};

const DeleteBoutique = async (req, res) => {
  try {
    const { _id } = req.query;
    const removedBoutique = await BoutiqueModel.remove({ _id });
    if (!removedBoutique) {
      return res
        .status(400)
        .json({ Message: "Probléme dans la suppression de le boutique" });
    }
    return res.status(200).json({ Message: "boutique a été supprimé" });
  } catch (error) {
    console.log("##########:", error);
    res.status(500).send({ Message: "Server Error", Error: error.message });
  }
};

const BoutiquesPage = async (req, res) => {
  const user = req.session?.context?.user || null;
  try {
    const boutiques = await BoutiqueModel.find();

    if (!boutiques || boutiques.length === 0) {
      return res.render("boutiques", {
        boutiques: boutiques,
        user: user,
        boutiques_error: "il n'y a pas des  boutiques",
      });
    }

    return res.render("boutiques", {
      boutiques: boutiques,
      user: user,
      boutiques_error: "",
    });
  } catch (error) {
    console.log("##########:", error);
    res.status(400).send({ Message: "Server Error", Error: error.message });
  }
};

const OneBoutiquePage = async (req, res) => {
  const { _id } = req.params;
  const boutique_error = req?.session?.context?.boutique_error || "";
  const user = req.session?.context?.user || null;
  try {
    const boutique = await BoutiqueModel.findOne({ _id });
    if (!boutique) {
      return res.render("boutique", {
        boutique: boutique,
        user: user,
        boutique_error: "boutique n'est pas exist",
      });
    }
    return res.render("boutique", {
      boutique: boutique,
      user: user,
      boutique_error: boutique_error,
    });
  } catch (error) {
    console.log("##########:", error);
    return res.render("boutique", {
      boutique: {},
      user: user,
      boutique_error: "boutique n'est pas exist",
    });
  }
};

module.exports = {
  AddBoutique,
  AllBoutiques,
  UpdateBoutique,
  DeleteBoutique,
  BoutiquesPage,
  OneBoutiquePage,
};
