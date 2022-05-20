const articlesRouter = require("express").Router();
const {
  getArticleById,
  updateArticleVotes,
  getArticles,
} = require("../controllers/articlesControllers");
const {
  getCommentsByArticleId,
  postNewCommentByArticleId,
} = require("../controllers/commentsControllers");

articlesRouter.get("/", getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateArticleVotes);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postNewCommentByArticleId);

module.exports = articlesRouter;
