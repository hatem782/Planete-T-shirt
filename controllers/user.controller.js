const UserModel = require("../models/User.schema");
const bcrypt = require("bcrypt");

const Register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    console.log({ firstName, lastName, email, password });
    //--------------------------------------------------------------------------
    // verifier si l'utilisateur existe deja
    let existUser = await UserModel.findOne({ email });
    if (existUser) {
      req.session.context = {
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
      password: cryptedMdp,
    });
    const newUser = await user.save();

    if (!newUser) {
      req.session.context = {
        register_error: "erreur dans la creaction d'utilisateur",
      };
      return res.redirect("/connection");
    }

    //--------------------------------------------------------------------------
    // creation terminé
    req.session.context = {
      user: newUser,
    };
    return res.redirect("/Acceuil");
  } catch (error) {
    console.log("##########:", error);

    req.session.context = {
      register_error: "erreur dans la creaction d'utilisateur",
    };
    return res.redirect("/connection");
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log({ email, password });
    //--------------------------------------------------------------------------
    // Verify user by mail
    let existUser = await UserModel.findOne({ email });
    if (!existUser) {
      req.session.context = {
        login_error: "Verifier votre email et password",
      };
      return res.redirect("/connection");
    }

    //--------------------------------------------------------------------------
    // Verify user password
    const passMatch = await bcrypt.compare(password, existUser?.password);
    if (!passMatch) {
      req.session.context = {
        login_error: "Verifier votre email et password",
      };
      return res.redirect("/connection");
    }
    //--------------------------------------------------------------------------
    //-------------------------------YEEEY WE DID IT----------------------------
    req.session.context = {
      user: existUser,
    };
    return res.redirect("/Acceuil");
    //--------------------------------------------------------------------------
    //--------------------------------------------------------------------------
  } catch (error) {
    console.log("##########:", error);
    req.session.context = {
      login_error: "Verifier votre email et password",
    };
    return res.redirect("/connection");
  }
};

const Deconnection = async (req, res) => {
  req.session.destroy();
  return res.redirect("/Acceuil");
};

module.exports = {
  Register,
  Login,
  Deconnection,
};
