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

  it("Add a new location", async () => {
    const res1 = await request(app).post("/api/locations/add", {
        headers: {
          "x-auth-token": token
        }
      }).send({
        location: "Plant 5",
      });
      expect(res1.body).toBeTruthy();
  });

  it("Retrieve all locations", async () => {
    const res1 = await request(app).get("/api/locations/", {
        headers: {
          "x-auth-token": token,
        },
      });
      expect(res1.body).toBeTruthy();
  });
});