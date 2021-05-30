
const spotsRouter = require('express').Router()
const Spot = require('../models/spot')

spotsRouter.get('/', async (request, response) => {
    const spots = await Spot.find({})
    response.json(spots)
})

spotsRouter.get('/:id', (request, response, next) => {
    try {
        const spot = await Spot.findById(request.params.id)
        if (spot) {
            response.json(spot)
        } else {
            response.status(404).end()
        }
    } catch (exception) {
        next(exception)                     // passing off to error handling middleware
    }
})

spotsRouter.post('/', async (request, response, next) => {
    const body = request.body

    const spot = new Spot({
        activity: body.activity,
        location: body.location,
        date: new Date(),
    })
    try {
        const savedSpot = await spot.save()
        response.json(savedSpot)
    } catch (exception) {
        next(exception)
    }
    
})

spotsRouter.delete('/:id', (request, response, next) => {
    try {
        const spot = await Spot.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } catch (exception) {
        next(exception)                    
    }
})

module.exports = spotsRouter
