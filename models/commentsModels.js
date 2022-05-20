const db = require("../db/connection");
const { fetchUsersFromDb } = require("./usersModels");

exports.fetchCommentsByArticleIdFromDb = (id) => {
  const queryStr = `
        SELECT 
        comment_id,
        votes,
        created_at,
        author,
        body,
        article_id
        FROM comments
        WHERE article_id = $1
    `;

  return db.query(queryStr, [id]).then((data) => {
    return data.rows;
  });
};

exports.addNewCommentToDbByArticleId = (id, newComment) => {
  const { username, body } = newComment;

  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  const queryStr = `
    INSERT INTO comments 
    (body, article_id, author, votes)
    VALUES
    ($1, $2, $3, $4)
    RETURNING *
  `;

  return fetchUsersFromDb()
    .then((users) => {
      const usernames = users.map((userObj) => {
        return userObj.username;
      });

      if (!usernames.includes(username)) {
        return Promise.reject({ status: 401, msg: "User not found" });
      } else {
        return db.query(queryStr, [body, id, username, 0]);
      }
    })
    .then((data) => {
      return data.rows[0];
    });
};

exports.removeCommentByIdFromDb = (id) => {
  const queryStr = `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *
  `;

  return db.query(queryStr, [id]).then((data) => {
    const deletedComment = data.rows[0];
    if (!deletedComment) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
  });
};

exports.patchCommentVotesByIdInDb = (id, inc_votes) => {
  const queryStr = `
    UPDATE comments
    SET votes = votes + $2
    WHERE comment_id = $1
    RETURNING *
  `;

  return db.query(queryStr, [id, inc_votes]).then((data) => {
    const updatedComent = data.rows[0];

    if (!updatedComent) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }

    return updatedComent;
  });
};
