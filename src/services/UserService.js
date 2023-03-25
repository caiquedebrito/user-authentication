const User = require("../db/schemas/User")

module.exports = class UserService {
  static async create(user) {
    await new User(user).save()
  }

  static async delete(id) {
    await User.deleteOne({ id })
  }

  static async update(userId, newUser) {
    await User.updateOne({ _id: userId }, newUser)
  }

  static async findById(id) {
    const user = await User.findById(id)
    return user
  }

  static async findByEmail(email) {
      const user = await User.findOne({ email })
      return user
  }

  static async list() {
    const users = await User.find({ isPrivate: false }, { userName: 1, _id: 0 })

    return users
  }
}