const apiRouter = require("express").Router();
const info = require("../endpoints.json");

apiRouter.get("/", (req, res) => {
  res.status(200).send(info);
});


module.exports = apiRouter;
