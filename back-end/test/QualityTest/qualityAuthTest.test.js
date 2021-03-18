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

  it("Add a specific quality item", async () =>{
    const res1 = await request(app).post("/api/quality/add",{
        headers: {
          "x-auth-token": token
        }
    }).send({
      name: "Saddle",
      type: "part",
      location: "Plant 1"
    });
    expect(res1.body).toBeTruthy();
  });
  it("Retrieve all quality data", async () => {
    const res1 = await request(app).get("/api/quality/", {
        headers: {
            "x-auth-token": token,
          },
        });
        expect(res1.body).toBeTruthy();
     });

    it("Retrieve specific quality data by name", async() => {
        const res1 = await request(app).post("/api/quality/", {
            headers: {
                "x-auth-token": token
                }
        }).send({
            name: "Saddle"
        });
        expect(res1.body).toBeTruthy();
    });

  it("Retrieve specific quality data by location", async () => {
    const res1 = await request(app).post("/api/quality/location", {
        headers: {
            "x-auth-token":token
        }
    }).send({
        location: "Plant 1",
    });
    expect(res1.body).toBeTruthy();
  });

});
