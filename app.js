const express = require("express");
const apiRouter = require("./routes/apiRouter");
const topicsRouter = require("./routes/topicsRouter");
const articlesRouter = require("./routes/articlesRouter");
const usersRouter = require("./routes/usersRouter");
const commentsRouter = require("./routes/commentsRouter");

const {
  handlePSQLErrors,
  handleCustomErrors,
  handleInternalServerErrors,
} = require("./controllers/errorsControllers");

const app = express();

app.use(express.json());

// Info
app.use("/api", apiRouter);

// Topics
app.use("/api/topics", topicsRouter);

// Articles
app.use("/api/articles", articlesRouter);

// Users
app.use("/api/users", usersRouter);

// Comments
app.use("/api/comments", commentsRouter);

// Errors
app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleInternalServerErrors);

module.exports = app;
