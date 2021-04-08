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

  it("retrieve user by name ", async () => {
    const res1 = await request(app)
      .post("/api/auth/name")
      .set("x-auth-token", token)
      .send({
        name: "admin",
      });
      expect(res1.body).toBeTruthy();
  });
});

describe("Get Endpoints", () => {
  it("retrieve user by token", async () => {
    const res2 = await request(app).get("/api/auth").set("x-auth-token", token);
    expect(res2.body).toBeTruthy();
  });

  it("retrieve all user information", async () => {
    const res2 = await request(app)
      .get("/api/auth/all")
      .set("x-auth-token", token);
    expect(res2.body).toBeTruthy();
  });
});

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
        data: "{}"
    });
    expect(res1.body).toBeTruthy();
});

it("Add plan Sales", async () => {
    const res1 = await request(app).post("/api/Planning/addPlanSales", {
        headers: {
            "x-auth-token": token
        }
    }).send({
        data: "{}"
    });
    expect(res1.body).toBeTruthy();
});

it("Add Production Actual", async () => {
    const res1 = await request(app).post("/api/Planning/addProdActual", {
        headers: {
            "x-auth-token": token
        }
    }).send({
        data: "{}"
    });
    expect(res1.body).toBeTruthy();
});
