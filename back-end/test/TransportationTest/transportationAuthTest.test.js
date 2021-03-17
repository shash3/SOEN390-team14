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

it("receiving completed shipments ", async () => {
    const res = await request(app).get("/api/transportation/completed");
    
    expect(res.body).toBeTruthy();
});

it('tests adding a shipment', async() => {
    const body ={
    name:"test",
    quantity:99,
    type:"test",
    location:"test",
    destination:"test",
    status:"test",
    
    }
    const res2 = await request(app).get('/api/transportation/add',body).set('x-auth-token', token)
    
    expect(res2.body).toBeTruthy();
})
it('tests adding a shipmentfrom procurements', async() => {
    const body ={
    name:"test",
    quantity:99,
    type:"test",
    location:"test",
    destination:"test",
    status:"test",
    packagingStatus:false
    }
    const res2 = await request(app).get('/api/transportation/addP',body).set('x-auth-token', token)
    
    expect(res2.body).toBeTruthy();
})
it('tests deletion', async() => {
   
    const res2 = await request(app).post('/api/transportation/deleteN',"test").set('x-auth-token', token)
    
    expect(res2.body).toBeTruthy();
})


