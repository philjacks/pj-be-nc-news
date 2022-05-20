const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topicsControllers");

topicsRouter.get("/", getTopics);

module.exports = topicsRouter;
