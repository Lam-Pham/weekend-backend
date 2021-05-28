
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