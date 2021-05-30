
const spotsRouter = require('express').Router()
const Spot = require('../models/spot')

spotsRouter.get('/', async (request, response) => {
    const spots = await Spot.find({})
    response.json(spots)
})

spotsRouter.get('/:id', (request, response, next) => {
    Spot.findById(request.params.id)
        .then(spot => {
            if (spot) {
                response.json(spot)
            } else {
                response.status(404).end()
            } 
        })
        .catch(error => next(error))            // passing off to error handling middleware
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
    Note.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

module.exports = spotsRouter
