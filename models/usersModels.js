const db = require("../db/connection");

exports.fetchUsersFromDb = () => {
  const queryStr = `
     SELECT username FROM users
    `;

  return db.query(queryStr).then((data) => {
    return data.rows;
  });
};
