const express = require("express");
const { getTopics } = require("./controllers/topicsControllers");
const { getArticleById } = require("./controllers/articlesControllers");

const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

module.exports = app;
