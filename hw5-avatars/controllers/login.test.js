const mongoose = require("mongoose");
const request = require("supertest");
require("dotenv").config();

const { DB_HOST, PORT = 3000 } = process.env;

const app = require("../app");

describe("test login controller", () => {
  let server;
  mongoose.set("strictQuery", false);

  beforeAll(() => {
    mongoose
      .connect(DB_HOST)
      .then(() => {
        server = app.listen(PORT);
      })
      .catch((error) => {
        console.log(error.message);
        process.exit(1);
      });
  });

  afterAll(() => {
    server.close();
    mongoose.connection.close();
  });

  test("User login ", async () => {
    const payload = {
      email: "user7@mail.ua",
      password: "12345678",
    };
    const response = await request(app)
      .post("/users/login")
      .send(payload)
      .set("Content-Type", "application/json");
    expect(response.status).toBe(200);

    const { token } = response.body;
    expect(typeof token).toBe("string");
    expect(token).not.toBe("");

    const { user } = response.body;
    expect(Object.keys(user).length).toBe(2);
    expect(typeof user.email).toBe("string");
    expect(typeof user.subscription).toBe("string");
  });
});
