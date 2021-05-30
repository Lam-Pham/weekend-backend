
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Spot = require('../models/spot')

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

    const contents = spotsAtEnd.map(s => [s.activity, s.location])
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

test('a specific spot can be viewed', async () => {
    const spotsAtStart = await helper.spotsInDb()
    const spotToView = spotsAtStart[0]
    console.log(spotToView)

    const resultSpot = await api
        .get(`/api/spots/${spotToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const processedSpotToView = JSON.parse(JSON.stringify(spotToView))
    expect(resultSpot.body).toEqual(processedSpotToView)
})

afterAll(() => {
  mongoose.connection.close()
})