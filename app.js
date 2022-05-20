const express = require("express");
const apiRouter = require("./routes/apiRouter");
const { getTopics } = require("./controllers/topicsControllers");
const { getUsers } = require("./controllers/usersControllers");
const {
  getCommentsByArticleId,
  postNewCommentByArticleId,
  deleteCommentById,
} = require("./controllers/commentsControllers");
const {
  getArticleById,
  updateArticleVotes,
  getArticles,
} = require("./controllers/articlesControllers");
const {
  handlePSQLErrors,
  handleCustomErrors,
  handleInternalServerErrors,
} = require("./controllers/errorsControllers");

const app = express();

app.use(express.json());

// Info
app.use("/api", apiRouter);

// Topics
app.get("/api/topics", getTopics);

// Articles
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", updateArticleVotes);

// Comments
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postNewCommentByArticleId);
app.delete("/api/comments/:comment_id", deleteCommentById);

// Users
app.get("/api/users", getUsers);

// Errors
app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleInternalServerErrors);

module.exports = app;
