const mongoose = require("mongoose");
const request = require("supertest");
require("dotenv").config();

const { DB_HOST, PORT = 3000 } = process.env;

const app = require("../app");

describe("test getAll controller", () => {
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

  test("getAll return users array", async () => {
    const response = await request(app).get("/users");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    const [user] = response.body;
    expect(typeof user._id).toBe("string");
    expect(typeof user.email).toBe("string");
    expect(typeof user.avatarURL).toBe("string");
  });
});
