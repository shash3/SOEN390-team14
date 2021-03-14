const request = require("supertest");
const app = require("../../server.js");

let token = "";

describe("Post Endpoints", () => {
  it("test logging in ", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "admin@gmail.com",
      password: "12345678",
    });
    token = res.body.token;
    expect(res.body.token).toBeTruthy();
    expect(res.body.permission).toBeTruthy();
  });

  it("retrieve user by name ", async () => {
    const res1 = await request(app)
      .post("/api/auth/name")
      .set("x-auth-token", token)
      .send({
        name: "admin",
      });
      expect(res1.body).toBeTruthy();
  });
});

describe("Get Endpoints", () => {
  it("retrieve user by token", async () => {
    const res2 = await request(app).get("/api/auth").set("x-auth-token", token);
    expect(res2.body).toBeTruthy();
  });

  it("retrieve all user information", async () => {
    const res2 = await request(app)
      .get("/api/auth/all")
      .set("x-auth-token", token);
    expect(res2.body).toBeTruthy();
  });
});
