const request = require("supertest");
const app = require("../../server.js");

let token = "";
it("test logging in ", async () => {
    const res = await request(app).post("/api/auth/login").send({
        email: "production@gmail.com",
        password: "12345678",
    });
    token = res.body.token;
});

it("receiving sales ", async () => {
    const res = await request(app).get("/api/sales");
    
    expect(res.body).toBeTruthy();
});
it("receiving receivables ", async () => {
    const res = await request(app).get("/api/sales/receivables");
    
    expect(res.body).toBeTruthy();
});

it('tests adding a sale', async() => {
    const body ={
    name:"test",
    quantity:99,
    purchaser:"test",
    location:"test",
    value: 99,
    date: Date.now(),
    paid:false
    }
    const res2 = await request(app).post('/api/sales/add',{
        headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json',
          },
    }).send(JSON.stringify(body));
    
    
    expect(res2.body).toBeTruthy();
})

it('tests deletion', async() => {
   
    const res2 = await request(app).post('/api/sales/deleteN',"test").set('x-auth-token', token)
    
    expect(res2.body).toBeTruthy();
});


