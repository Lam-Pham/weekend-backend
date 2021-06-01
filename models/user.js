const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  username: {
      type: String,
      unique: true
  },
  name: String,
  passwordHash: String,
  spots: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Spot'
    }
  ],
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash                  // hide password
  }
})

module.exports = mongoose.model('User', userSchema)