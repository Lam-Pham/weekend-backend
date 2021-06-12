
const artsRouter = require('express').Router()
const Art = require('../models/art')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {   
      return authorization.substring(7)
    }
    return null
}

artsRouter.get('/', async (request, response) => {
    const arts = await Art
        .find({}).populate('user', { username: 1, name: 1 })
    response.json(arts)
})

artsRouter.get('/:id', async (request, response) => {
    const art = await Art.findById(request.params.id)
    if (art) {
        response.json(art)
    } else {
        response.status(404).end()
    }
})

artsRouter.post('/', async (request, response) => {
    const body = request.body

    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    const art = new Art({
        piece: body.piece,
        description: body.description,
        date: new Date(),
        user: user._id
    })
    const savedArt = await art.save()
    user.arts = user.arts.concat(savedArt._id)           // adding art to user
    await user.save()

    response.json(savedArt)
})

artsRouter.delete('/:id', async (request, response) => {
    const art = await Art.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

module.exports = artsRouter
