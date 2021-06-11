const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  username: {
      type: String,
      unique: true
  },
  passwordHash: String,
  arts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Art'
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