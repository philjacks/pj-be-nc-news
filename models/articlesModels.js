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

exports.fetchArticlesFromDb = () => {
  const queryStr = `
        SELECT articles.*,
        COUNT(comments.article_id) AS comment_count
        FROM articles
        LEFT JOIN comments
        ON comments.article_id = articles.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC
    `;
  return db.query(queryStr).then((data) => {
    return data.rows.map((article) => {
      return {
        ...article,
        comment_count: parseInt(article.comment_count),
      };
    });
  });
};
