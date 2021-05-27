
const spotsRouter = require('express').Router()
const Spot = require('./models/spot')

spotsRouter.get('/', (request, response) => {
    Spot.find({})
        .then(spots => {
            response.json(notes)
        })
})

spotsRouter.get(':id', (request, response, next) => {
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

spotsRouter.post('/', (request, response, next) => {
    const body = request.body

    const spot = new Spot({
        activity: body.activity,
        location: body.location,
        date: new Date(),
    })

    spot.save()
        .then(savedSpot => {
            response.json(savedSpot)
        })
        .catch(error => next(error))
})
