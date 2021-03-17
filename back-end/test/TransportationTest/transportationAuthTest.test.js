const request = require("supertest");
const app = require("../../server.js");

let token = "";
describe("Post Endpoints", () => {
  it("create testing user", async () => {
    await request(app).post("/api/users/admin").send({
      name: "admin",
      email: "admin@gmail.com",
      password: "12345678",
    });
  });

  it("create testing user", async () => {
    await request(app).post("/api/users/admin").send({
      name: "admin",
      email: "admin@gmail.com",
      password: "12345678",
    });
  });

  it("test logging in ", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "admin@gmail.com",
      password: "12345678",
    });
    token = res.body.token;
    expect(res.body.token).toBeTruthy();
    expect(res.body.permission).toBeTruthy();
  });

  it("Gets the test endpoint", async () => {
    // Sends GET Request to /test endpoint
    const res2 = await request(app)
      .get("/api/transportation")
      .set("x-auth-token", token);
    expect(res2.body).toBeTruthy();
  });
});
