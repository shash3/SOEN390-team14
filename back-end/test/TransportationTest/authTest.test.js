const request = require("supertest");
const app = require("../../server.js");

it("test logging in ", async () => {
    const res = await request(app).post("/api/auth/login").send({
        email: "production@gmail.com",
        password: "12345678",
    });
    token = res.body.token;
});

it('Gets the test endpoint', async() => {
    // Sends GET Request to /test endpoint
    const res2 = await request(app).get('/api/transportation').set('x-auth-token', token)
    console.log(res2.body)
    expect(res2.body).toBeTruthy();
})