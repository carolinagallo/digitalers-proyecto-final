const express = require("express");
const mongoose = require("mongoose");
const Article = require("../models/article");
const methodOverride = require("method-override");
const app = express();
const articleRouter = require("../routes/article");
const port = process.env.PORT || 3000;

//llamamos al archivo .env
require("dotenv").config();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

//ruta principal home
app.get("/", async (req, res) => {
  const articles = await Article.find().sort({
    createdAt: "desc",
  });

  res.render("articles/index", { articles: articles });
});

//mongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("conectado a MongoDB Atlas");
  })
  .catch((err) => console.error(err));

app.use("/articles", articleRouter);

app.use("/public/", express.static("./public/"));

app.listen(port, () => console.log(`Server escuchando en puerto ${port}`));
