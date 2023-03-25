const { verify } = require("jsonwebtoken")

const authenticateUser = (request, response, next) => {
  const authToken = request.headers.authorization

  if (!authToken) {
    return response.status(401).json({ message: "Token is missing!" })
  }

  const [, token] = authToken.split(" ")

  try {
    verify(token, process.env.ACCESS_TOKEN_SECRET)
    return next()
  } catch(error) {
    return response.status(403).json({ message: "Token invalid!" })
  }
}

module.exports = authenticateUser