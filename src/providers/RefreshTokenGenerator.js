const { sign } = require("jsonwebtoken")

class RefreshTokenGenerator {
  generate(userId) {
    return sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" })
  }
}

const refreshTokenGenerator = new RefreshTokenGenerator()

module.exports = refreshTokenGenerator