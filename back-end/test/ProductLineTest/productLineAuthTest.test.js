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
      expect(res.body.token).toBeTruthy();
      expect(res.body.permission).toBeTruthy();
    });

  it("retrieve product line by name ", async () => {
    const res1 = await request(app).post("/api/product_line", {
        headers: {
          "x-auth-token": token,
        },
      }).send({
        name: "Saddle",
        material:[["Leather",1],["Seat Rod",1],["Seat Frame",1],["Sponge",1],["Steel Spring",2],["Clamp",1],["Screws",6]]
      });
      expect(res1.body).toBeTruthy();
  });

  it("Getting all product lines ", async () => {
      const res1 = await request(app).get("/api/product_line/", {
          headers: {
            "x-auth-token": token,
          },
        }).send({
          name: "Saddle",
          material:[["Leather",1],["Seat Rod",1],["Seat Frame",1],["Sponge",1],["Steel Spring",2],["Clamp",1],["Screws",6]]
        });
        expect(res1.body).toBeTruthy();
    });

    it("Adding new product line ", async () => {
      const res1 = await request(app).post("/api/product_line/add", {
          headers: {
            "x-auth-token": token,
          },
        }).send({
          name: "New Prod"
        });
        
    });
});
