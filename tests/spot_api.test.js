
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Spot = require('../models/spot')

beforeEach(async () => {
  await Spot.deleteMany({})                                           
  const spotObjects = helper.initialSpots.map(spot => new Spot(spot))   // array of Mongoose objects
  const promiseArray = spotObjects.map(spot => spot.save())             // array of promises
  await Promise.all(promiseArray)                                       // waits for every promise to finish
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

    const resultSpot = await api
        .get(`/api/spots/${spotToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const processedSpotToView = JSON.parse(JSON.stringify(spotToView))
    expect(resultSpot.body).toEqual(processedSpotToView)
})

test('a spot can be deleted', async () => {
    const spotsAtStart = await helper.spotsInDb()
    const spotToDelete = spotsAtStart[0]

    await api
        .delete(`/api/spots/${spotToDelete.id}`)
        .expect(204)

    const spotsAtEnd = await helper.spotsInDb()

    expect(spotsAtEnd).toHaveLength(
        helper.initialSpots.length - 1
    )

    const contents = spotsAtEnd.map(s => [s.activity, s.location])
    expect(contents).not.toContain([spotToDelete.activity, spotToDelete.location])
})

afterAll(() => {
  mongoose.connection.close()
})