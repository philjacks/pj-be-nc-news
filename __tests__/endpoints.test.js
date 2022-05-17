const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");

beforeEach(() => seed(testData));

afterAll(() => db.end());

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

describe("GET /api/articles/:article_id", () => {
  test("Status 200 - should return an object containing the correct properties for an article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          author: "butter_bridge",
          created_at: "2020-07-09T20:11:00.000Z",
          topic: "mitch",
          votes: 100,
          body: "I find this existence challenging",
        });
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
