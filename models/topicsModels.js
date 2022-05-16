const db = require("../db/connection");

exports.fetchTopicsFromDb = () => {
  const qeuryStr = `
    SELECT * FROM topics
    `;
  return db.query(qeuryStr).then((data) => {
    
    return data.rows;
  });
};
