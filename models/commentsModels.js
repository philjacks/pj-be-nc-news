const db = require("../db/connection");

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
    const comments = data.rows;
    if (comments.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
    return data.rows;
  });
};
