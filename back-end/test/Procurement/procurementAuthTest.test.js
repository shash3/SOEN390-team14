const request = require("supertest");
const app = require("../../server.js");

it("test logging in ", async () => {
    const res = await request(app).post("/api/auth/login").send({
        email: "production@gmail.com",
        password: "12345678",
    });
    token = res.body.token;
});
it("receiving shipments ", async () => {
    const res = await request(app).get("/api/transportation");
    
    expect(res.body).toBeTruthy();
});

it("receiving items in packaging ", async () => {
    const res = await request(app).get("/api/transportation/packaging");
    
    expect(res.body).toBeTruthy();
});


it('tests adding a procurement', async() => {
    const body ={
    name:"test",
    quantity:99,
    supplier:"test",
    destination:"test",
    value:"test",
    date: Date.now(),
    paid:false
    }
    const res2 = await request(app).post('/api/procurement/add',{
        headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json',
          },
    }).send(JSON.stringify(body));
    
    
    expect(res2.body).toBeTruthy();
})

it('tests deletion', async() => {
   
    const res2 = await request(app).post('/api/procurement/deleteN',"test").set('x-auth-token', token)
    
    expect(res2.body).toBeTruthy();
});


