const {
  fetchCommentsByArticleIdFromDb,
  addNewCommentToDbByArticleId,
} = require("../models/commentsModels");
const { fetchArticleByIdFromDb } = require("../models/articlesModels");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  Promise.all([
    fetchArticleByIdFromDb(article_id),
    fetchCommentsByArticleIdFromDb(article_id),
  ])
    .then(([_, comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postNewCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;

  addNewCommentToDbByArticleId(article_id, newComment)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
