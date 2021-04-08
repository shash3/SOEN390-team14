const request = require("supertest");
const app = require("../../server.js");

let token = "";

it("planned Production", async () => {
  const res = await request(app).get("/api/Planning/prod", {
    headers: {
      "x-auth-token": token,
    },
  });
  expect(res.body).toBeTruthy();
});

it("planned Sales", async () => {
  const res = await request(app).get("/api/Planning/sales", {
    headers: {
      "x-auth-token": token,
    },
  });
  expect(res.body).toBeTruthy();
});

it("planned Production actual", async () => {
  const res = await request(app).get("/api/Planning/prodActual", {
    headers: {
      "x-auth-token": token,
    },
  });
  expect(res.body).toBeTruthy();
});

it("planned Sales actual", async () => {
  const res = await request(app).get("/api/Planning/salesActual", {
    headers: {
      "x-auth-token": token,
    },
  });
  expect(res.body).toBeTruthy();
});

it("Add plan Production", async () => {
  const res1 = await request(app).post("/api/Planning/addPlanProd", {
      headers: {
        "x-auth-token": token
      }
    }).send({
      "{}",
    });
    expect(res1.body).toBeTruthy();
});

it("Add plan Sales", async () => {
  const res1 = await request(app).post("/api/Planning/addPlanSales", {
      headers: {
        "x-auth-token": token
      }
    }).send({
    "{}",
    });
    expect(res1.body).toBeTruthy();
});

it("Add Production Actual", async () => {
  const res1 = await request(app).post("/api/Planning/addProdActual", {
      headers: {
        "x-auth-token": token
      }
    }).send({
      "{}",
    });
    expect(res1.body).toBeTruthy();
});
