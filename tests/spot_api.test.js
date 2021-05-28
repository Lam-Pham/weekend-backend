
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('spots are returned as json', async () => {
    await api
        .get('/api/spots')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there are at least two spots', async () => {
    const response = await api.get('/api/spots')
  
    expect(response.body).not.toHaveLength(0 || 1)
})

afterAll(() => {
  mongoose.connection.close()
})