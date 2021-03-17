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

  it("Add a new machine", async () => {
    const res1 = await request(app).post("/api/machine/add", {
        headers: {
          "x-auth-token": token
        }
      }).send({
        location: "Plant 1",
      });
      expect(res1.body).toBeTruthy();
  });

  it("Retrieve all machines", async () => {
    const res1 = await request(app).get("/api/machine/", {
        headers: {
          "x-auth-token": token,
        },
      });
      expect(res1.body).toBeTruthy();
  });

  it("Retrieve specific machines by location", async () => {
    const res1 = await request(app).post("/api/machine/location", {
        headers: {
          "x-auth-token": token
        }
      }).send({
        location: "Plant 5",
      });
      expect(res1.body).toBeTruthy();
  });

  it("Retrieve specific machines by location", async () => {
    const res1 = await request(app).post("/api/machine/unavailable", {
        headers: {
          "x-auth-token": token
        }
      }).send({
        location: "Plant 5",
      });
      expect(res1.body).toBeTruthy();
  });

  it("Retrieve specific machines by location", async () => {
    const res1 = await request(app).post("/api/machine/available", {
        headers: {
          "x-auth-token": token
        }
      }).send({
        location: "Plant 5",
      });
      expect(res1.body).toBeTruthy();
  });

});