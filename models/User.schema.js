const { Schema, model } = require("mongoose");

const userSchema = Schema({
  firstName: String,
  lastName: String,
  telephone: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlengh: 8,
  },
});

module.exports = model("UserABC", userSchema);
