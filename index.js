const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
app.use(requestLogger)
app.use(express.static('build'))

let spots = [
    {
        id: 1,
        activity: "Go surfing",
        location: "Seal Beach",
        date: "2019-05-30T17:30:31.098Z"
      },
      {
        id: 2,
        activity: "Get food and drinks",
        location: "2nd and PCH",
        date: "2019-05-30T18:39:34.091Z"
      },
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/spots', (request, response) => {
  response.json(spots)
})

app.get('/api/spots/:id', (request, response) => {
    const id = Number(request.params.id)
    const spot = spots.find(spot => spot.id === id)

    if (spot) {
        response.json(spot)
    } else {
        response.status(404).end()
    }
})

app.post('/api/spots', (request, response) => {
    const body = request.body
    if (!body.activity || !body.location) {
        return response.status(400).json({ 
          error: 'content missing' 
        })
    }
    
    const newId = spots.length > 0
    ? (Math.max(...spots.map(n => n.id))+1) 
    : 0

    const spot = {
        activity: body.activity,
        location: body.location,
        date: new Date(),
        id: newId
    }

    spots = spots.concat(spot)

    response.json(spot)
})

app.delete('/api/spots/:id', (request, response) => {
    const id = Number(request.params.id)
    spots = spots.filter(spot => spot.id !== id)
  
    response.status(204).end()
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})