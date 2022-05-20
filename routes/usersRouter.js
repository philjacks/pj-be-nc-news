const usersRouter = require("express").Router();
const { getUsers, getUserByUsername } = require("../controllers/usersControllers");

usersRouter.get("/", getUsers);

usersRouter.get("/:username", getUserByUsername)

module.exports = usersRouter;
