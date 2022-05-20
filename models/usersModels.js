const db = require("../db/connection");

exports.fetchUsersFromDb = () => {
  const queryStr = `
     SELECT * FROM users
    `;

  return db.query(queryStr).then((data) => {
    return data.rows;
  });
};

exports.getUserByUsernameFromDb = (username) => {
  const queryStr = `
    SELECT * FROM users
    WHERE username = $1
  `;

  return db.query(queryStr, [username]).then((data) => {
    const user = data.rows[0];

    if (!user) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }

    return data.rows[0];
  });
};
