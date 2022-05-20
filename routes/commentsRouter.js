const commentsRouter = require("express").Router();
const { deleteCommentById } = require("../controllers/commentsControllers");

commentsRouter.delete("/:comment_id", deleteCommentById);

module.exports = commentsRouter;
