const { fetchTopicsFromDb } = require("../models/topicsModels");

exports.getTopics = (req, res) => {
  fetchTopicsFromDb()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .then((err) => {
      console.log(err);
      // error console logged temporarily until more complex endpoints
    });
};
