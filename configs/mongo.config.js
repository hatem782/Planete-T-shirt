const mongoose = require("mongoose");

const connectDB = () => {
  try {
    mongoose.connect(process.env.DB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("database connected");
  } catch (error) {
    console.log("can not connect", error);
  }
};
// export
module.exports = connectDB;
