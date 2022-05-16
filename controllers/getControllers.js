const { fetchTopicsFromDb } = require("../models/getModels");

exports.getTopics = (req, res) => {
  fetchTopicsFromDb().then((topics) => {
    res.status(200).send({ topics });
  });
};
