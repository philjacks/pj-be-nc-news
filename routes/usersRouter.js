const usersRouter = require("express").Router();
const { getUsers } = require("../controllers/usersControllers");

usersRouter.get("/", getUsers);

module.exports = usersRouter;
