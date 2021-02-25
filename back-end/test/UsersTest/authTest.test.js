const request = require("supertest");
const app = require("../../server.js");

describe("Post Endpoints", () => {
  it("test logging in ", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "admin@gmail.com",
      password: "12345678",
    });
    expect(res.body.token).toBeTruthy();
    expect(res.body.permission).toBeTruthy();
  });
});
