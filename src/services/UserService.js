const User = require("../db/schemas/User")

module.exports = class UserService {
  static async create(user) {
    try {
      await new User(user).save()
    } catch (error) {
      
    }
  }

  static async delete(id) {
    try {
      const result = await User.deleteOne({ id })
    } catch (error) {

    }
  }

  static async update(userId, newUser) {
    try {
      await User.updateOne({ _id: userId }, newUser)
    } catch (error) {

    }
  }

  static async findById(id) {
    try {
      const user = await User.findById(id)
      return user
    } catch (error) {

    }
  }

  static async findByEmail(email) {
    try {
      const user = await User.findOne({ email })
      return user
    } catch (error) {

    }
  }

  static async list() {
    try {
      const users = await User.find({ isPrivate: false }, { userName: 1, _id: 0 })

      return users
    } catch (error) {

    }
  }
}