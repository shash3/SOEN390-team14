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

  it("Add a specific inventory item", async () => {
    const res1 = await request(app).post("/api/inventory/add", {
        headers: {
          "x-auth-token": token
        }
      }).send({
        name: "Saddle",
        quantity: 5,
        location: "Plant 1",
        type: "part",
      });
      expect(res1.body).toBeTruthy();
  });

  it("Retrieve all inventory", async () => {
    const res1 = await request(app).get("/api/inventory/", {
        headers: {
          "x-auth-token": token,
        },
      });
      expect(res1.body).toBeTruthy();
  });

  it("Retrieve specific inventory by name", async () => {
    const res1 = await request(app).post("/api/inventory/", {
        headers: {
          "x-auth-token": token
        }
      }).send({
        name: "Saddle"
      });
      expect(res1.body).toBeTruthy();
  });
  it("Retrieve specific inventory by name and location", async () => {
    const res1 = await request(app).post("/api/inventory/location", {
        headers: {
          "x-auth-token": token
        }
      }).send({
        name: "Saddle",
        location: "Plant 1",
      });
      expect(res1.body).toBeTruthy();
  });
  it("Change a specific inventory item to a new quantity", async () => {
    const res1 = await request(app).put("/api/inventory/remove", {
        headers: {
          "x-auth-token": token
        }
      }).send({
        name: "Saddle",
        quantity: 3,
        location: "Plant 1",
      });
      expect(res1.body).toBeTruthy();
  });

  it("Decrement a specific inventory item by a quantity", async () => {
    const res1 = await request(app).put("/api/inventory/decrement", {
        headers: {
          "x-auth-token": token
        }
      }).send({
        name: "Saddle",
        quantity: 1,
        location: "Plant 1",
      });
      expect(res1.body).toBeTruthy();
  });

  it("Sets a specific inventory item to a quantity", async () => {
    const res1 = await request(app).put("/api/inventory/superUpdate", {
        headers: {
          "x-auth-token": token
        }
      }).send({
        name: "Saddle",
        quantity: 4,
        location: "Plant 1",
      });
      expect(res1.body).toBeTruthy();
  });

  it("Add a specific inventory item to a quantity is does not exist from update", async () => {
    const res1 = await request(app).put("/api/inventory/superUpdate", {
        headers: {
          "x-auth-token": token
        }
      }).send({
        name: "Saddle",
        quantity: 3,
        location: "Plant 2",
      });
      expect(res1.body).toBeTruthy();
  });

  it("Increment a specific inventory item by a quantity", async () => {
    const res1 = await request(app).put("/api/inventory/superIncrement", {
        headers: {
          "x-auth-token": token
        }
      }).send({
        name: "Saddle",
        quantity: 1,
        location: "Plant 2",
      });
      expect(res1.body).toBeTruthy();
  });

  it("Add a specific inventory item to a quantity if does not exist from increment", async () => {
    const res1 = await request(app).put("/api/inventory/superIncrement", {
        headers: {
          "x-auth-token": token
        }
      }).send({
        name: "Saddle",
        quantity: 3,
        location: "Plant 3",
      });
      expect(res1.body).toBeTruthy();
  });

});