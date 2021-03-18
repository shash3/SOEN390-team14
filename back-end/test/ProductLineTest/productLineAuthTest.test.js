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

  it("Adding new product line ", async () => {
    const res1 = await request(app).post("/api/product_line/add", {
      headers: {
        "x-auth-token": token,
      },
    }).send({
      name: "New Prod",
      type: "part",
      material:[["Saddle",4],["Leather",2]],
    });
    expect(res1.body).toBeTruthy();
  });

  it("Getting all product lines ", async () => {
    const res1 = await request(app).get("/api/product_line", {
      headers: {
        "x-auth-token": token,
      },
    });
    expect(res1.body).toBeTruthy();
  });

  it("retrieve product line by name ", async () => {
    const res1 = await request(app).post("/api/product_line", {
      headers: {
        "x-auth-token": token,
      },
    }).send({
      name: "New Prod",
    });
    expect(res1.body).toBeTruthy();
  });
    
});
