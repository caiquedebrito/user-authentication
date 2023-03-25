const UserService = require("../services/UserService")
const bcrypt = require("bcrypt")
const tokenGenerator = require("../providers/TokenGenerator")
const RefreshToken = require("../db/schemas/RefreshToken")
const refreshTokenGenerator = require("../providers/RefreshTokenGenerator")
const { verify } = require("jsonwebtoken")

module.exports = class UserController {

  static async getAllUser(_, response) {
    try {
      const users = await UserService.list()
      return response.status(200).json(users)
    } catch(e) {
      return response.status(500).send()
    }
  }

  static async getUser(request, response) {
    try {
      const { email, password } = request.body
      const user = await UserService.findByEmail(email)

      if (!email || !password) {
        return response.status(400).json({ error: { code: 160, message: "Missing information!"}})
      }

      if (!user) {
        return response.status(401).json({ error: { code: 100, message: "E-mail or password incorrect!"}})

      }

      if (!(await bcrypt.compare(password, user.password))) {
        return response.status(401).json({ error: { code: 100, message: "E-mail or password incorrect!"}})
      }

      const userData = {
        id: user._id.toString(),
        userName: user.userName,
        isPrivate: user.isPrivate
      }

      const token = tokenGenerator.generate(userData)
      const refreshToken = refreshTokenGenerator.generate(userData.id)

      RefreshToken({ refreshToken, userData }).save()

      return response.status(200).json({ userData, token, refreshToken })

    } catch (error) {
      return response.status(500).send()
    }
  }

  static async createUser(request, response) {
    try {
      const { userName, email, password, isPrivate } = request.body

      if (!userName || !email || !password || !isPrivate.toString()) {
        return response.status(400).json({ error: { code: 160, message: "Missing information!"}})
      }

      const user = await UserService.findByEmail(email)

      if (user) {
        return response.status(400).json({ error: { code: 130, message: "User already exists!"}})
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      await UserService.create({ userName, email, password: hashedPassword, isPrivate })

      return response.status(201).send()

    } catch (error) {
      return response.status(500).send()
    }
  }

  static async uptadeUser(request, response) {
    try {
      const { id, password, newCredentials: { newPassword, newUserName, isPrivate } } = request.body

      const user = await UserService.findById(id)

      if (
        !user || 
        !(await bcrypt.compare(password, user.password))
      ) {
        return response.status(401).send()
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

      const uptadedUser = {
        id: user._id,
        userName: newUserName,
        isPrivate
      }

      // gerar novo token
      const token = tokenGenerator.generate(uptadedUser)
      const refreshToken = refreshTokenGenerator.generate(uptadedUser.id)

      return response.status(200).json({ token, refreshToken, ...uptadedUser})
    } catch (error) {
      return response.status(500).send()
    }
  }

  static async deleteUser(request, response) {
    try {
      const { id, password } = request.body

      const user = await UserService.findById(id)

      if (
        !user || 
        !(await bcrypt.compare(password, user.password))
      ) {
        return response.status(401).send()
      }

      RefreshToken.deleteMany({ "userData.id": id })

      await UserService.delete(id)

      return response.status(200).send()
    } catch(error) {
      return response.status(500).send()
    }
  }

  static async getToken(request, response) {
    const { refreshToken } = request.body

    if (!refreshToken) {
      return response.status(401).json({ error: { code: 140, message: "Refresh token is missing!"}})
    }

    const savedRefreshToken = await RefreshToken.findOne({ refreshToken })

    if (!savedRefreshToken) {
      return response.status(403).json({ error: { code: 150, message: "Invalid refresh token!"}})
    }

    try {
      verify(savedRefreshToken.refreshToken, process.env.REFRESH_TOKEN_SECRET)

      await RefreshToken.deleteOne({ refreshToken })

      const userData = {
        id: savedRefreshToken.userData.id.toString(),
        userName: savedRefreshToken.userData.userName,
        isPrivate: savedRefreshToken.userData.isPrivate
      }

      const token = tokenGenerator.generate(userData)

      const newRefreshToken = refreshTokenGenerator.generate(userData.id)

      RefreshToken({refreshToken: newRefreshToken, userData }).save()

      return response.status(200).json({ token, refreshToken: newRefreshToken, userData })
    } catch(error) {
      RefreshToken.deleteOne({ refreshToken })
      return response.status(403).json({ error: { code: 150, message: "Invalid refresh token!"}})
    }
  }

  static async logout(request, response) {
    const { refreshToken } = request.body

    if (!refreshToken) {
      return response.status(403).send()
    }

    try {
      await RefreshToken.deleteOne({refreshToken})

      return response.status(200).send()
    } catch (error) {
      return response.status(500).send()
    }
  }
}