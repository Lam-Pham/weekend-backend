const capsulesRouter = require('express').Router()
const Art = require('../models/art')
const User = require('../models/user')
const Capsule = require('../models/capsule')

capsulesRouter.get('/', async (request, response) => {
    const capsules = await Capsule
        .find({}).populate('arts', { piece: 1, description: 1 })
    response.json(capsules)
})

capsulesRouter.post('/', async (request, response) => {
    const body = request.body

    const capsule = new Capsule({
        title: body.title,
        description: body.description,
        date: new Date()
    })
    const savedCapsule = await capsule.save()

    response.json(savedCapsule)
})

module.exports = capsulesRouter