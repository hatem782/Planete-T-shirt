const express = require("express");
const session = require("express-session");
const mongoDB = require("./configs/mongo.config");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const routes = require("./routes/AllRoutes.routes");

//---------------------Configs------------------------
const app = express();
dotenv.config();
app.use(cors());
app.options("*", cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(session({ secret: "mySecret", resave: true, saveUninitialized: true }));
app.set("view engine", "ejs");
app.set("views", "views");

//---------------------Server-------------------------
app.listen(process.env.PORT || 8080, () => {
  console.log(process.env.PORT);
  mongoDB();
});

// routes and urls

app.use("/", routes);

module.exports = app;
