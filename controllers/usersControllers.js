const { fetchUsersFromDb } = require("../models/usersModels");

exports.getUsers = (req, res, next) => {
  fetchUsersFromDb()
    .then((usernames) => {
      res.status(200).send({ usernames });
    })
    .catch((err) => {
      next(err);
    });
};
