require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Spot = require('./models/spot')

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

// MIDDLEWARE

app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)
app.use(cors())

// ROUTES

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/spots', (request, response) => {
    Spot.find({}).then(spots => {
        response.json(spots)
    })
})

app.get('/api/spots/:id', (request, response) => {
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

app.post('/api/spots', (request, response) => {
    const body = request.body
    if ((body.activity || body.location) === undefined) {
        return response.status(400).json({ 
          error: 'content missing' 
        })
    }

    const spot = new Spot({
        activity: body.activity,
        location: body.location,
        date: new Date(),
    })

    spot.save().then(savedSpot => {
        response.json(savedSpot)
    })
})

app.delete('/api/spots/:id', (request, response) => {
    const id = Number(request.params.id)
    spots = spots.filter(spot => spot.id !== id)
  
    response.status(204).end()
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
// handler of requests with result to unknown endpoints
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
}
  
// handler of requests with result to errors
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})