const db = require("../db/connection");

exports.fetchTopicsFromDb = () => {
  const qeuryStr = `
    SELECT * FROM topics
    `;
  return db.query(qeuryStr).then((data) => {
    return data.rows;
  });
};

exports.postNewTopicToDb = (newTopic) => {
  const { slug, description } = newTopic;

  

  if (typeof slug !== "string" || typeof description !== "string") {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  const qeuryStr = `
    INSERT INTO topics
    (slug, description)
    VALUES 
    ($1, $2)
    RETURNING *
  `;

  return db.query(qeuryStr, [slug, description]).then((data) => {
    return data.rows[0];
  });
};
