
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const usersRouter = require('./controllers/users')
const artsRouter = require('./controllers/arts')
const collectionsRouter = require('./controllers/collections')
const loginRouter = require('./controllers/login')


logger.info('connecting to', config.MONGODB_URI)
url = config.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(result => {
        logger.info('connected to MongoDB!')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/users', usersRouter)
app.use('/api/arts', artsRouter)
app.use('/api/collections', collectionsRouter)
app.use('/api/login', loginRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
