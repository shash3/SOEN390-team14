const request = require("supertest");
const app = require("../../server.js");

describe("Post Endpoints", () => {
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
  });

  it("receiving procurements ", async () => {
    const rest = await request(app).post("/api/auth/login").send({
      email: "admin@gmail.com",
      password: "12345678",
    });
    const token = rest.body.token;
    const res = await request(app).get("/api/procurement");

    expect(res.body).toBeTruthy();
  });
  it("receiving payables ", async () => {
    const rest = await request(app).post("/api/auth/login").send({
      email: "admin@gmail.com",
      password: "12345678",
    });
    const token = rest.body.token;

    const res = await request(app).get("/api/procurement/payables");

    expect(res.body).toBeTruthy();
  });

  it("tests adding a procurement", async () => {
    const rest = await request(app).post("/api/auth/login").send({
      email: "admin@gmail.com",
      password: "12345678",
    });
    const token = rest.body.token;
    console.log(rest.body);
    const body = {
      name: "test",
      quantity: 99,
      supplier: "test",
      destination: "test",
      value: "test",
      date: Date.now(),
      paid: false,
    };
    const res2 = await request(app)
      .post({
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
        url: "/api/procurement/add",
        body: body,
      })
      .send(JSON.stringify(body));

    console.log(res2.body);
    expect(res2.body).toBeTruthy();
  });

  it("tests deletion", async () => {
    const rest = await request(app).post("/api/auth/login").send({
      email: "admin@gmail.com",
      password: "12345678",
    });
    const token = rest.body.token;

    const res2 = await request(app)
      .post("/api/procurement/deleteN", "test")
      .set("x-auth-token", token);

    expect(res2.body).toBeTruthy();
  });
});
