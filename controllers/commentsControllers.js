const {
  fetchCommentsByArticleIdFromDb,
  addNewCommentToDbByArticleId,
} = require("../models/commentsModels");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  fetchCommentsByArticleIdFromDb(article_id)
    .then((comments) => {
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
