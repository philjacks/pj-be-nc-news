const {
  fetchCommentsByArticleIdFromDb,
  addNewCommentToDbByArticleId,
  removeCommentByIdFromDb,
  patchCommentVotesByIdInDb,
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

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  removeCommentByIdFromDb(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateCommentVotesById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  patchCommentVotesByIdInDb(comment_id, inc_votes)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
