const articlesRouter = require("express").Router();
const {
  getArticleById,
  updateArticleVotes,
  getArticles,
  postNewArticle
} = require("../controllers/articlesControllers");
const {
  getCommentsByArticleId,
  postNewCommentByArticleId,
} = require("../controllers/commentsControllers");

articlesRouter.route("/").get(getArticles).post(postNewArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateArticleVotes);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postNewCommentByArticleId);

module.exports = articlesRouter;
