const mongoose = require('mongoose')

const url = config.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(result => {
        logger.info('connected to MongoDB!')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })

const spotSchema = new mongoose.Schema({
    activity: {
      type: String,
      required: true
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
})

spotSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('Spot', spotSchema)