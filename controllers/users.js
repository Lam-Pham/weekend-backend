
const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')                    // password encryption

usersRouter.post('/', async (request, response) => {
  const body = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    passwordHash,
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({}).populate('arts', {piece: 1, description: 1})             // populate swaps out ids for referenced documents
    response.json(users)
})

module.exports = usersRouter