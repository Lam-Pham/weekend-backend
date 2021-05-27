const express = require('express')
const app = express()
const cors = require('cors')
const Spot = require('./models/spot')

const config = require('./utils/config')
const logger = require('./utils/logger')

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



const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
// handler of requests with result to unknown endpoints
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)
  
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }
  
    next(error)
}
  
// handler of requests with result to errors
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})