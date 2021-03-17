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
  
  it("test logging in ", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "admin@gmail.com",
      password: "12345678",
    });
    token = res.body.token;
  });

  it("Add a new material", async () => {
    const res1 = await request(app).post("/api/material/add", {
      headers: {
        "x-auth-token": token,
      },
    }).send({
      name: "Screw",
      type: "raw",
    });
    expect(res1.body).toBeTruthy();
  });

  it("Retrieve all inventory", async () => {
    const res1 = await request(app).get("/api/material/", {
      headers: {
        "x-auth-token": token,
      },
    });
    expect(res1.body).toBeTruthy();
  });
  
  it("Retrieve specific inventory by name", async () => {
    const res1 = await request(app).post("/api/material/", {
      headers: {
        "x-auth-token": token,
      },
    }).send({
      name: "Screw",
    });
    expect(res1.body).toBeTruthy();
  });
});