const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
require("jest-sorted");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("GET /api", () => {
  test("Status 200 - should respond with a json object containing info on all other endpoints ", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
      });
  });
});

describe("GET /api/topics", () => {
  test("Status 200 - should return with an array of topics containing slug & description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toBeInstanceOf(Array);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("POST /api/topics", () => {
  test("Status 201 - should respond with a newly created topic object", () => {
    const newTopic = {
      slug: "beans",
      description: "57 kinds of Heinz",
    };

    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(201)
      .then(({ body: { topic } }) => {
        expect(topic).toEqual({
          slug: "beans",
          description: "57 kinds of Heinz",
        });
      });
  });

  test("Status 400 - returns bad request if topic already exists", () => {
    const newTopic = {
      slug: "mitch",
      description: "The man, the Mitch, the legend",
    };

    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test("Status 400 - returns bad request if the wrong data type is passed into the request body", () => {
    const newTopic = {
      slug: 7,
      description: "The man, the Mitch, the legend",
    };

    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test("Status 400 - returns bad request if request body is empty", () => {
    const newTopic = {};

    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("Status 200 - should return an object containing the correct properties for an article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            author: "butter_bridge",
            created_at: "2020-07-09T20:11:00.000Z",
            topic: "mitch",
            votes: 100,
            body: "I find this existence challenging",
          })
        );
      });
  });

  test("Status 404 - should return an error message if article doesn't exist", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });

  test("Status 400 - should return an error message if the wrong data type is passed to the url", () => {
    return request(app)
      .get("/api/articles/beans")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("Status 200 - should return the updated object with increased votes when passed a positive number", () => {
    const inc_votes = {
      votes: 2,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(inc_votes)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          author: "butter_bridge",
          created_at: "2020-07-09T20:11:00.000Z",
          topic: "mitch",
          votes: 102,
          body: "I find this existence challenging",
        });
      });
  });

  test("Status 200 - should return the updated object with decreased votes when passed a negative number", () => {
    const inc_votes = {
      votes: -50,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(inc_votes)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          author: "butter_bridge",
          created_at: "2020-07-09T20:11:00.000Z",
          topic: "mitch",
          votes: 50,
          body: "I find this existence challenging",
        });
      });
  });

  test("Status 400 - should return an error if the request body votes missing", () => {
    const inc_votes = {};
    return request(app)
      .patch("/api/articles/1")
      .send(inc_votes)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test("Status 400 - should return an error if the request body votes are not an integer", () => {
    const inc_votes = {
      votes: "beans",
    };
    return request(app)
      .patch("/api/articles/1")
      .send(inc_votes)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test("Status 404 - should return an error message if article doesn't exist", () => {
    return request(app)
      .patch("/api/articles/999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });

  test("Status 400 - should return an error message if the wrong data type is passed to the url", () => {
    return request(app)
      .get("/api/articles/beans")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("Status 200 - should return with an array of objects containing a username", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
          });
        });
      });
  });

  test("Status 200 - should return with an array of objects containing all the correct user properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id - with comment_count", () => {
  test("Status 200 - should return an object containing the correct properties for an article including a comment count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            author: "butter_bridge",
            created_at: "2020-07-09T20:11:00.000Z",
            topic: "mitch",
            votes: 100,
            body: "I find this existence challenging",
            comment_count: 11,
          })
        );
      });
  });
});

describe("GET /api/articles", () => {
  test("Status 200 - should return an array of article objects containing all the correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article).toStrictEqual({
            article_id: expect.any(Number),
            title: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            topic: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
      });
  });

  test("Status 200 - should return an array of article objects sorted in descending order by date as default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("Status 200 - should return an array of article objects sorted in descending order by title when passed as a query", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("title", { descending: true });
      });
  });

  test("Status 400 - should return an error message if an invalid sort_by is passed", () => {
    return request(app)
      .get("/api/articles?sort_by=beans")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test("Status 200 - should return an array of article objects sorted in ASCENDING order by date when passed as a query", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { ascending: true });
      });
  });

  test("Status 400 - should return an error message if an invalid order is passed", () => {
    return request(app)
      .get("/api/articles?order=bae")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test("Status 200 - should return an array of article objects filtered by the topic mitch when passed as a query", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(11);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            topic: "mitch",
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
      });
  });

  test("Status 200 - should return an array of article objects filtered by the topic cats when passed as a query", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(1);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            topic: "cats",
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("Status 200 - should return an array of comments via article id with the correct properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(11);
        comments.forEach((comment) => {
          expect(comment).toEqual({
            comment_id: expect.any(Number),
            body: expect.any(String),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });

  test("Status 200 - should return an empty array if the article exists but there are no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(0);
      });
  });

  test("Status 404 - should return an error message if article doesn't exist and therefore no comments exist", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });

  test("Status 400 - should return an error message if the wrong data type is passed to the url", () => {
    return request(app)
      .get("/api/articles/beans/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("Status 201 - creates a new comment in the database and returns it in the response", () => {
    const newComment = {
      username: "lurker",
      body: "The first rule of fight club is.....post videos of the fights all over social media",
    };

    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual({
          author: "lurker",
          body: "The first rule of fight club is.....post videos of the fights all over social media",
          article_id: 2,
          votes: 0,
          comment_id: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });

  test("Status 404 - should return an error message if the article doesn't exist", () => {
    const newComment = {
      username: "lurker",
      body: "The first rule of fight club is.....post videos of the fights all over social media",
    };
    return request(app)
      .post("/api/articles/999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article not found");
      });
  });

  test("Status 400 - should return an error message if the wrong data type is passed as a param", () => {
    const newComment = {
      username: "lurker",
      body: "The first rule of fight club is.....post videos of the fights all over social media",
    };
    return request(app)
      .post("/api/articles/beans/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test("Status 401 - should return an error message if the username does not exist in the users database", () => {
    const newComment = {
      username: "timmy",
      body: "The first rule of fight club is.....post videos of the fights all over social media",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(401)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("User not found");
      });
  });

  test("Status 400 - should return an error message if incorrect data is in the request body", () => {
    const newComment = {
      votes: 2,
      body: true,
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("Status 204 - should return a no content success status when deleting a comment by id", () => {
    return request(app)
      .delete("/api/comments/18")
      .expect(204)
      .then(() => {
        return db.query(`SELECT * FROM comments WHERE comment_id = 18`);
      })
      .then((data) => {
        expect(data.rows).toEqual([]);
      });
  });

  test("Status 400 - should return a bad request error if an invalid data type is passed as a param", () => {
    return request(app)
      .delete("/api/comments/beans")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test("Status 404 - should return a not found error if passed a valid id but doesn't exist", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
});

describe("GET /api/users/:username", () => {
  test("Status 200 - responds with a user object containing the correct properties", () => {
    return request(app)
      .get("/api/users/rogersop")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toEqual(
          expect.objectContaining({
            username: "rogersop",
            name: "paul",
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
          })
        );
      });
  });

  test("Status 404 - returns error message if username doesn't exist", () => {
    return request(app)
      .get("/api/users/morty")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("Status 200 - should return a comment object with an updated votes value", () => {
    const inc_votes = {
      inc_votes: 2,
    };
    return request(app)
      .patch("/api/comments/1")
      .send(inc_votes)
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual({
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 18,
          author: "butter_bridge",
          article_id: 9,
          created_at: "2020-04-06T12:17:00.000Z",
        });
      });
  });

  test("Status 200 - should return a comment object with an updated votes value when passed a negative number", () => {
    const inc_votes = {
      inc_votes: -2,
    };
    return request(app)
      .patch("/api/comments/1")
      .send(inc_votes)
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual({
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 14,
          author: "butter_bridge",
          article_id: 9,
          created_at: "2020-04-06T12:17:00.000Z",
        });
      });
  });

  test("Status 400 - should return an error message if passed an invalid param", () => {
    const inc_votes = {
      inc_votes: 2,
    };
    return request(app)
      .patch("/api/comments/beans")
      .send(inc_votes)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test("Status 404 - should return an error message if the comment doesn't exist", () => {
    const inc_votes = {
      inc_votes: 2,
    };
    return request(app)
      .patch("/api/comments/999")
      .send(inc_votes)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });

  test("Status 400 - should return an error if the request body votes are not an integer", () => {
    const inc_votes = {
      votes: "beans",
    };
    return request(app)
      .patch("/api/comments/1")
      .send(inc_votes)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test("Status 400 - should return an error if the request body is empty", () => {
    const inc_votes = {};
    return request(app)
      .patch("/api/comments/1")
      .send(inc_votes)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("POST /api/articles", () => {
  test("Status 201 - should respond with a newly created article object", () => {
    const newArticle = {
      author: "icellusedkars",
      title: "How The Wind Blows",
      body: "It just blows",
      topic: "paper",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          article_id: expect.any(Number),
          author: "icellusedkars",
          title: "How The Wind Blows",
          body: "It just blows",
          topic: "paper",
          votes: 0,
          created_at: expect.any(String),
          comment_count: 0,
        });
      });
  });

  test("Status 401 - should return an error if user doesn't exist in the database", () => {
    const newArticle = {
      author: "lil timmy",
      title: "How The Wind Blows",
      body: "It just blows",
      topic: "paper",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(401)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("User not found");
      });
  });

  test("Status 400 - should return error message if incorrect data is passed into the request body", () => {
    const newArticle = {
      author: "icellusedkars",
      title: true,
      topic: 2,
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("DELETE /api/articles/:article_id", () => {
  test("Status 204 - should return a no content code when successfully deleted an article", () => {
    return request(app)
      .delete("/api/articles/2")
      .expect(204)
      .then(() => {
        return db.query(`SELECT * FROM articles WHERE article_id = 2`);
      })
      .then((data) => {
        expect(data.rows).toEqual([]);
      });
  });

  test("Status 400 - should return a bad request error if an invalid data type is passed as a param", () => {
    return request(app)
      .delete("/api/articles/beans")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test("Status 404 - should return a not found error if passed a valid id but doesn't exist", () => {
    return request(app)
      .delete("/api/articles/999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
});
