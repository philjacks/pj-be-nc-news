const commentsRouter = require("express").Router();
const {
  deleteCommentById,
  updateCommentVotesById,
} = require("../controllers/commentsControllers");

commentsRouter
  .route("/:comment_id")
  .delete(deleteCommentById)
  .patch(updateCommentVotesById);

module.exports = commentsRouter;
