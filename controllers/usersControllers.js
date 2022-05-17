const { fetchUsersFromDb } = require("../models/usersModels");

exports.getUsers = (req, res, next) => {
  fetchUsersFromDb()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};
