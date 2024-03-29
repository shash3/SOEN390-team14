const request = require('supertest')
const app = require('../../server.js')

let token = ''

describe('Post Endpoints', () => {
  it('create testing user', async () => {
    await request(app).post('/api/users/admin').send({
      name: 'admin',
      email: 'admin@gmail.com',
      password: '12345678',
    })
  })

  it('test logging in ', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'admin@gmail.com',
      password: '12345678',
    })
    token = res.body.token
  })

  it('Add a procurement', async () => {
    const res1 = await request(app)
      .post('/api/procurement/add', {
        headers: {
          'x-auth-token': token,
        },
      })
      .send({
        name: 'Saddle',
        quantity: 2,
        supplier: 'Supplier 1',
        destination: 'Plant 1',
        value: 10,
        date: new Date(),
      })
    expect(res1.body).toBeTruthy()
  })

  it('Get all procurements', async () => {
    const res1 = await request(app).get('/api/procurement', {
      headers: {
        'x-auth-token': token,
      },
    })
    expect(res1.body).toBeTruthy()
  })

  it('Get procurements with no paid', async () => {
    const res1 = await request(app).get('/api/procurement/payables', {
      headers: {
        'x-auth-token': token,
      },
    })
    expect(res1.body).toBeTruthy()
  })

  it('Get procurements with paid', async () => {
    const res1 = await request(app).get('/api/procurement/payablesP', {
      headers: {
        'x-auth-token': token,
      },
    })
    expect(res1.body).toBeTruthy()
  })
})
