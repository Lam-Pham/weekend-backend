const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(result => {
        console.log('connected to MongoDB!')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const spotSchema = new mongoose.Schema({
  activity: String,
  location: String,
  date: Date,
})

spotSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('Spot', spotSchema)