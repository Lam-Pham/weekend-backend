const express = require('express')
const app = express()

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

app.delete('/api/spots/:id', (request, response) => {
    const id = Number(request.params.id)
    spots = spots.filter(spot => spot.id !== id)
  
    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})