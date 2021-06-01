const Spot = require('../models/spot')
const User = require('../models/user')

const initialSpots = [
  {
    activity: 'Ride bikes',
    location: 'Long Beach',
    date: new Date(),
  },
  {
    activity: 'Eat thai food',
    location: 'Mink Quan',
    date: new Date(),
  },
]

const nonExistingId = async () => {
  const spot = new Spot({ activity: 'willremovethissoon', location: 'willremovethissoon', date: new Date() })
  await spot.save()
  await spot.remove()

  return spot._id.toString()
}

const spotsInDb = async () => {
  const spots = await Spot.find({})
  return spots.map(spot => spot.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = {
  initialSpots, nonExistingId, spotsInDb, usersInDb
}