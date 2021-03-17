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

  it("Gets the test endpoint", async () => {
    // Sends GET Request to /test endpoint
    const res2 = await request(app)
      .get("/api/transportation")
      .set("x-auth-token", token);
    expect(res2.body).toBeTruthy();
  });

  it("retrive all shipments", async () => {
    const res1 = await request(app).get("/api/transportation/", {
        headers: {
          "x-auth-token": token
        }
      }).send({
        name: "saddle"
      });
      expect(res1.body).toBeTruthy();
  })

  it("retrive all completed shipments", async () => {
    const status = await request(app).get("/api/transportation/completed", {
        headers: {
          "x-auth-token": token
        }
      }).send({
        status: "completed"
      });
      expect(status.body).toBeTruthy();
  })

  it("retrive all shipment that have been packaged", async () => {
    const status = await request(app).get("/api/transportation/completed", {
        headers: {
          "x-auth-token": token
        }
      }).send({
        packagingStatus: "true"
      });
      expect(status.body).toBeTruthy();
  })

  it("Retrieve specific shipment by name", async () => {
    const res1 = await request(app).post("/api/transportation/", {
        headers: {
          "x-auth-token": token
        }
      }).send({
        name: "Saddle"
      });
      expect(res1.body).toBeTruthy();
  });

  it("change shipment status", async () => {
    const res1 = await request(app).post("/api/transportation/changeStatus", {
        headers: {
          "x-auth-token": token
        }
      }).send({
        status: "complete"
      });
      expect(res1.body).toBeTruthy();
  });
});


