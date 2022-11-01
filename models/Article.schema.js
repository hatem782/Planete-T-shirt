const { Schema, model } = require("mongoose");

const articleSchema = Schema({
  name: {
    type: String,
    require: true,
  },
  photo: String,
  description: String,
  price: {
    type: Number,
    minLengh: 1,
    require: true,
  },
  size: {
    type: String,
    maxLengh: 1,
    require: true,
  },
});

module.exports = model("ArticleABC", articleSchema);
