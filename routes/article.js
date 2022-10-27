const express = require("express");
const res = require("express/lib/response");
const { db } = require("../models/article");
const Article = require("../models/article");
const router = express.Router();

//obtenemos nuevo articulo

router.get("/new", (req, res) => {
  res.render("articles/new", { article: new Article() });
});

//obtenemos el art a aditar
router.get("/edit/:id", async (req, res) => {
  const article = await Article.findById(req.params.id);
  res.render("articles/edit", { article: article });
});

// obetener el art por slug
router.get("/:slug", async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  if (article == null) res.redirect("/");
  res.render("articles/show", { article: article });
});

//crear nuevo art
router.post(
  "/",
  async (req, res, next) => {
    req.article = new Article();
    next();
  },
  saveArticuleAndRedirect("new")
);

//editar articulo por id
router.put(
  "/:id",
  async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
  },
  saveArticuleAndRedirect("edit")
);

//favorite
router.put(
  "/:id/favorite",
  async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
  },
  putFav()
);

// likear
router.put(
  "/:id/like",
  async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
  },
  incrementLikes()
);

//delete
router.delete("/:id", async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

//busqueda
router.post("/search/by-title", async (req, res) => {
  const articles = await Article.find({
    title: { $regex: req.body.title, $options: "i" },
  });

  res.render("articles/index", { articles: articles });
});

//guardar art y redirecciono
function saveArticuleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article;
    article.title = req.body.title;
    article.description = req.body.description;
    article.markdown = req.body.markdown;
    try {
      article = await article.save();
      res.redirect(`/articles/${article.slug}`);
    } catch (err) {
      res.render(`articles/${path}`, { article: article });
    }
  };
}

function putFav() {
  return async (req, res) => {
    let article = req.article;
    if (article.favorite) {
      article.favorite = false;
    } else {
      article.favorite = true;
    }
    article = await article.save();
    res.redirect("/");
  };
}

function incrementLikes() {
  return async (req, res) => {
    let article = req.article;
    article.likes++;
    article = article.save();
    res.redirect("/");
  };
}
module.exports = router;
