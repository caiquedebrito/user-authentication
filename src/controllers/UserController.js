const UserService = require("../services/UserService")
const bcrypt = require("bcrypt")

module.exports = class UserController {
  static async getAllUser(_, res) {
    try {
      const users = await UserService.list()
      res.status(200).json(users)
    } catch(e) {
      res.status(500).send()
    }
  }

  static async getUser(req, res) {
    try {
      const { email, password } = req.body
      const user = await UserService.findByEmail(email)

      if (!user) {
        res.status(401).json({ error: "E-mail or password incorrect!" })
      }

      if (!(await bcrypt.compare(password, user.password))) {
        res.status(401).json({ error: "E-mail or password incorrect!" })
      }

      const userData = {
        id: user._id,
        userName: user.userName,
        isPrivate: user.isPrivate
      }

      res.status(200).json(userData)

    } catch (error) {
      res.status(500).send()
    }
  }

  static async createUser(req, res) {
    try {
      const { email, userName, password, isPrivate } = req.body

      const user = await UserService.findByEmail(email)

      if (user) {
        return res.status(400).send()
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      await UserService.create({ userName, email, password: hashedPassword, isPrivate })

      res.status(201).send()

    } catch (error) {
      res.status(500).send()
    }
  }

  static async uptadeUser(req, res) {
    try {
      const { id, password, newCredentials: { newPassword, newUserName, isPrivate } } = req.body

      const user = await UserService.findById(id)

      if (
        !user || 
        !(await bcrypt.compare(password, user.password))
      ) {
        res.status(401).send()
      }

      const newUser = {}

      if (newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        newUser.password = hashedPassword
      }

      if (newUserName) {
        newUser.userName = newUserName
      }

      if (isPrivate !== undefined) {
        newUser.isPrivate = isPrivate
      }
      
      await UserService.update(id, newUser)

      res.status(200).send()
    } catch (error) {
      res.status(500).send()
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id, password } = req.body

      const user = await UserService.findById(id)

      if (
        !user || 
        !(await bcrypt.compare(password, user.password))
      ) {
        res.status(401).send()
      }

      await UserService.delete(id)

      res.status(200).send()
    } catch (error) {
      res.status(500).send()
    }
  }
}