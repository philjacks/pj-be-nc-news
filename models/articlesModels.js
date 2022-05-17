const db = require("../db/connection");

exports.fetchArticleByIdFromDb = (id) => {
  const queryStr = `
        SELECT * FROM articles
        WHERE article_id = $1
    `;
  return db
    .query(queryStr, [id])
    .then((data) => {
      const article = data.rows[0];
      if (!article) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return article;
    })
    .then((article) => {
      const queryStr = `
    SELECT * FROM comments
    WHERE article_id = $1
    `;
      return Promise.all([article, db.query(queryStr, [article.article_id])]);
    })
    .then(([article, commentsData]) => {
      const newArticle = {
        ...article,
        comment_count: commentsData.rows.length,
      };
      return newArticle;
    });
};

exports.updateArticleVotesInDb = (id, inc_votes) => {
  const queryStr = `
    UPDATE articles
    SET votes = votes + $2
    WHERE article_id = $1
    RETURNING *
  `;

  return db.query(queryStr, [id, inc_votes]).then((data) => {
    const article = data.rows[0];
    if (!article) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
    return data.rows[0];
  });
};
