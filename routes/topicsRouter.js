const topicsRouter = require("express").Router();
const { getTopics, postNewTopic } = require("../controllers/topicsControllers");

topicsRouter.route("/").get(getTopics).post(postNewTopic);

module.exports = topicsRouter;
