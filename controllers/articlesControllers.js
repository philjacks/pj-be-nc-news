const {
  fetchArticleByIdFromDb,
  updateArticleVotesInDb,
} = require("../models/articlesModels");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleByIdFromDb(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { votes } = req.body;

  updateArticleVotesInDb(article_id, votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
