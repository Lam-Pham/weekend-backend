const mongoose = require('mongoose')

const gallerySchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    arts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Art'
        }
    ]
})

gallerySchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('Gallery', gallerySchema)