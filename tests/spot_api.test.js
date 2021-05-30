
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

beforeEach(async () => {
  await Spot.deleteMany({})
  let spotObject = new Spot(helper.initialSpots[0])
  await spotObject.save()
  spotObject = new Spot(helper.initialSpots[1])
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

    const spotsAtEnd = await helper.spotsInDb()
    expect(spotsAtEnd).toHaveLength(helper.initialSpots.length + 1)

    const contents = spotsAtEnd.map(s => s.content)
    expect(contents).toContainEqual(
        ['testing the backend',
        'casa de Lam']
    )
})

test('spot without content is not added', async () => {
    const newSpot = {
        date: new Date()
    }
  
    await api
        .post('/api/spots')
        .send(newSpot)
        .expect(400)
  
    const spotsAtEnd = await helper.spotsInDb()
    expect(spotsAtEnd).toHaveLength(helper.initialSpots.length)
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