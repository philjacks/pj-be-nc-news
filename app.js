const express = require("express");
const { getTopics } = require("./controllers/topicsControllers");
const { getUsers } = require("./controllers/usersControllers");
const {
  getArticleById,
  updateArticleVotes,
  getArticles,
} = require("./controllers/articlesControllers");

const app = express();

app.use(express.json());

// Topics
app.get("/api/topics", getTopics);

// Articles
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", updateArticleVotes);

// Users
app.get("/api/users", getUsers);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: err.msg });
});

module.exports = app;
