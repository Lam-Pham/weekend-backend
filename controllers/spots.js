
const spotsRouter = require('express').Router()
const Spot = require('../models/spot')

spotsRouter.get('/', async (request, response) => {
    const spots = await Spot.find({})
    response.json(spots)
})

spotsRouter.get('/:id', async (request, response) => {
    const spot = await Spot.findById(request.params.id)
    if (spot) {
        response.json(spot)
    } else {
        response.status(404).end()
    }
})

spotsRouter.post('/', async (request, response) => {
    const body = request.body

    const spot = new Spot({
        activity: body.activity,
        location: body.location,
        date: new Date(),
    })
    const savedSpot = await spot.save()
    response.json(savedSpot)
})

spotsRouter.delete('/:id', async (request, response) => {
    const spot = await Spot.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

module.exports = spotsRouter
