const db = require("../db/connection");

exports.fetchArticleByIdFromDb = (id) => {
  const validId = /[0-9]+/.test(id);

  if (!validId) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  const queryStr = `
        SELECT * FROM articles
        WHERE article_id = $1
    `;
  return db.query(queryStr, [id]).then((data) => {
    const article = data.rows[0];
    if (!article) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
    return article;
  });
};
