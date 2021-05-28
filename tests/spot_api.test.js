
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Spot = require('../models/spot')
const initialSpots = [
  {
    activity: 'Ride bikes',
    location: 'Long Beach',
    date: new Date(),
  },
  {
    activity: 'Eat thai food',
    location: 'Mink Quan',
    date: new Date(),
  },
]

beforeEach(async () => {
  await Spot.deleteMany({})
  let spotObject = new Spot(initialSpots[0])
  await spotObject.save()
  spotObject = new Spot(initialSpots[1])
  await spotObject.save()
})

test('a valid spot can be added', async () => {
    const newSpot = {
        activity: 'testing the backend',
        location: 'casa de Lam',
        date: new Date()
    }

    await api
        .post('/api/spots')
        .send(newSpot)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/spots')

    const contents = response.body.map(r => [r.activity, r.location])

    expect(response.body).toHaveLength(initialSpots.length + 1)
    expect(contents).toContainEqual(
        ['testing the backend',
        'casa de Lam']
    )
})

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