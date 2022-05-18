const { parseInputDatesAsUTC } = require("pg/lib/defaults");
const db = require("../db/connection");

exports.fetchCommentsByArticleIdFromDb = (id) => {
  const queryStr = `
        SELECT *
        FROM comments
        WHERE article_id = $1
    `;

  return db.query(queryStr, [id]).then((data) => {
    const comments = data.rows;
    if (comments.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
    return data.rows;
  });
};

exports.addNewCommentToDbByArticleId = (id, newComment) => {
  const { username, body } = newComment;

  const queryStr = `
    INSERT INTO comments 
    (body, article_id, author, votes)
    VALUES
    ($1, $2, $3, $4)
    RETURNING *
  `;

  return db.query(queryStr, [body, id, username, 0]).then((data) => {
    return data.rows[0];
  });
};
