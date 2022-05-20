const {
  fetchTopicsFromDb,
  postNewTopicToDb,
} = require("../models/topicsModels");

exports.getTopics = (req, res, next) => {
  fetchTopicsFromDb()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postNewTopic = (req, res, next) => {
  const newTopic = req.body;

  postNewTopicToDb(newTopic)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch((err) => {
      next(err);
    });
};
