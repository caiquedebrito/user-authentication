const { sign } = require("jsonwebtoken")

class TokenGenerator {
  generate(userData) {
    return sign(userData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" })
  }
}

const tokenGenerator = new TokenGenerator()

module.exports = tokenGenerator