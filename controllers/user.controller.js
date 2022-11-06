const UserModel = require("../models/User.schema");
const PannierModel = require("../models/Pannier.schema");
const bcrypt = require("bcrypt");
const PassGenerator = require("../functions/PassGenerator");
const Mailer = require("../mail/mailer");

const Register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, telephone } = req.body;
    //--------------------------------------------------------------------------
    // verifier si l'utilisateur existe deja
    let existUser = await UserModel.findOne({ email });
    if (existUser) {
      req.session.context = {
        ...req.session.context,
        register_error: "Email est deja utilisée",
      };
      return res.redirect("/connection");
    }

    //--------------------------------------------------------------------------
    const cryptedMdp = await bcrypt.hash(password, 10);

    const user = new UserModel({
      firstName,
      lastName,
      email,
      telephone,
      password: cryptedMdp,
    });
    const newUser = await user.save();

    if (!newUser) {
      req.session.context = {
        ...req.session.context,
        register_error: "erreur dans la creaction d'utilisateur",
      };
      return res.redirect("/connection");
    }

    const panier = new PannierModel({
      idUser: newUser._id,
      totalprice: 0,
      approved: false,
    });

    const newpanier = await panier.save();

    //--------------------------------------------------------------------------
    // creation terminé
    req.session.context = {
      ...req.session.context,
      register_error: "",
      user: newUser,
    };
    return res.redirect("/Acceuil");
  } catch (error) {
    console.log("##########:", error);

    req.session.context = {
      ...req.session.context,
      register_error: "erreur dans la creaction d'utilisateur",
    };
    return res.redirect("/connection");
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //--------------------------------------------------------------------------
    // Verify user by mail
    let existUser = await UserModel.findOne({ email });
    if (!existUser) {
      req.session.context = {
        ...req.session.context,
        login_error: "Verifier votre email et password",
      };
      return res.redirect("/connection");
    }

    //--------------------------------------------------------------------------
    // Verify user password
    const passMatch = await bcrypt.compare(password, existUser?.password);
    if (!passMatch) {
      req.session.context = {
        ...req.session.context,
        login_error: "Verifier votre email et password",
      };
      return res.redirect("/connection");
    }
    //--------------------------------------------------------------------------
    //-------------------------------YEEEY WE DID IT----------------------------
    req.session.context = {
      ...req.session.context,
      login_error: "",
      user: existUser,
    };
    return res.redirect("/Acceuil");
    //--------------------------------------------------------------------------
    //--------------------------------------------------------------------------
  } catch (error) {
    console.log("##########:", error);
    req.session.context = {
      ...req.session.context,
      login_error: "Verifier votre email et password",
    };
    return res.redirect("/connection");
  }
};

const Deconnection = async (req, res) => {
  req.session.destroy();
  return res.redirect("/connection");
};

const ResetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    //--------------------------------------------------------------------------
    // Verify user by mail
    let existUser = await UserModel.findOne({ email });
    if (!existUser) {
      req.session.context = {
        forget_error: "Verifier votre email",
      };
      return res.redirect("/reinitialisation");
    }

    const generatedPass = PassGenerator();
    const message = ` <h3>Votre nouveaux mot-de-passe est : ${generatedPass}  </h3> `;

    const resetPassMailResp = await Mailer.sendMail(email, message);

    const cryptedMdp = await bcrypt.hash(generatedPass, 10);

    const updatedUser = await UserModel.findOneAndUpdate(
      {
        _id: existUser._id,
      },
      {
        password: cryptedMdp,
      }
    );

    if (!updatedUser) {
      req.session.context = {
        forget_error: "on peut pas sauvegarder le nouveau mot-de-pass",
      };
      return res.redirect("/reinitialisation");
    }

    req.session.context = {
      ...req.session.context,
      login_error: "un nouveau mot-de-passe a été envoyer a ton e-mail",
    };
    return res.redirect("/connection");
  } catch (error) {
    console.log("##########:", error);
    req.session.context = {
      forget_error: "Verifier votre email",
    };
    return res.redirect("/reinitialisation");
  }
};

const GetProfile = async (req, res) => {
  try {
    const user = req.session?.context?.user || null;

    if (!user) {
      req.session.context = {
        ...req.session.context,
        login_error: "tu dois connecter pour accéder à votre profile",
      };
      return res.redirect("/connection");
    }

    return res.render("session", {
      user: user,
    });
  } catch (error) {
    console.log("##########:", error);
    req.session.context = {
      login_error: "",
    };
    return res.redirect("/connection");
  }
};

module.exports = {
  Register,
  Login,
  Deconnection,
  ResetPassword,
  GetProfile,
};
