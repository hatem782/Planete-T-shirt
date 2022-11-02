const { Schema, model } = require("mongoose");

const panierSchema = Schema({
  idUser: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "UserABC",
  },
  totalprice: {
    type: Number,
    required: true,
    default: 0,
  },
  approved: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = model("PanierABC", panierSchema);
