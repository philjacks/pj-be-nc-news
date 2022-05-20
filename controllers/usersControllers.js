const {
  fetchUsersFromDb,
  getUserByUsernameFromDb,
} = require("../models/usersModels");

exports.getUsers = (req, res, next) => {
  fetchUsersFromDb()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;

  getUserByUsernameFromDb(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};
