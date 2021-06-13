const collectionsRouter = require('express').Router()
const Collection = require('../models/collection')

collectionsRouter.get('/', async (request, response) => {
    const collections = await Collection
        .find({}).populate('arts', { piece: 1, description: 1 })
    response.json(collections)
})

collectionsRouter.post('/', async (request, response) => {
    const body = request.body

    const collection = new Collection({
        title: body.title,
        description: body.description,
        date: new Date()
    })
    const savedCollection = await collection.save()

    response.json(savedCollection)
})

module.exports = collectionsRouter