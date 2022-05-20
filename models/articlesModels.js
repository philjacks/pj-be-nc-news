const db = require("../db/connection");
const { fetchUsersFromDb } = require("./usersModels");

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

exports.fetchArticlesFromDb = (
  sort_by = "created_at",
  order = "desc",
  topic
) => {
  const validSortBy = ["created_at", "title", "author", "votes"];
  const validOrder = ["ASC", "DESC"];
  const queryParams = [];

  let queryStr = `
        SELECT 
        articles.article_id,
        title,
        topic,
        articles.author,
        articles.created_at,
        articles.votes,
        COUNT(comments.article_id) AS comment_count
        FROM articles
        LEFT JOIN comments
        ON comments.article_id = articles.article_id
      `;

  if (topic) {
    queryStr += `WHERE topic LIKE $1`;
    queryParams.push(topic);
  }

  queryStr += ` GROUP BY articles.article_id`;

  if (order) {
    order = order.toUpperCase();
  }

  if (!validSortBy.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  } else {
    queryStr += ` ORDER BY articles.${sort_by} ${order}`;
  }

  return db.query(queryStr, queryParams).then((data) => {
    return data.rows.map((article) => {
      return {
        ...article,
        comment_count: parseInt(article.comment_count),
      };
    });
  });
};

exports.postNewArticleToDb = (newArticle) => {
  const { author, title, body, topic } = newArticle;

  const queryStr = `
    INSERT INTO articles
    (author, title, body, topic)
    VALUES
    ($1, $2, $3, $4)
    RETURNING *
  `;

  return fetchUsersFromDb()
    .then((users) => {
      const usernames = users.map((userObj) => {
        return userObj.username;
      });

      if (!usernames.includes(author)) {
        return Promise.reject({ status: 401, msg: "User not found" });
      } else {
        return db.query(queryStr, [author, title, body, topic]);
      }
    })
    .then((data) => {
      const newArticle = data.rows[0];
      return this.fetchArticleByIdFromDb(newArticle.article_id);
    });
};
