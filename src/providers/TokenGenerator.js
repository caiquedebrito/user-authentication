const { sign } = require("jsonwebtoken")

class TokenGenerator {
  generate(userData) {
    return sign(userData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1m" })
  }
}

const tokenGenerator = new TokenGenerator()

module.exports = tokenGenerator