const { fetchTopicsFromDb } = require("../models/topicsModels");

exports.getTopics = (req, res, next) => {
  fetchTopicsFromDb()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};
