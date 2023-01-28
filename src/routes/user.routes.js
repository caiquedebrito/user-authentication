const Router = require("express").Router
const bcrypt = require("bcrypt")
const UsersRepository = require("../repositories/UsersRepository")

const usersRepository = new UsersRepository()

const userRoute = Router()

function findEmail(req, res, next) {
  const userExits = usersRepository.get(req.body.email)

  if (userExits) {
    return res.status(401).send({ error: "Email already used!"})
  }

  next()
}

function findUser(req, res, next) {
  const user = usersRepository.get(req.body.email)
  
  if (!user) {
    return res.status(400).send({ error: "E-mail or password incorrect!"})
  }

  req.user = user
  next()
}

userRoute.get("/", (_, res) => {
  const users = usersRepository.getAll()
  res.json(users)
})

userRoute.post("/", findEmail, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    
    const user = { userName: req.body.userName, email: req.body.email, password: hashedPassword, isPrivate: req.body.isPrivate }

    usersRepository.create(user)

    res.status(201).send()

  } catch (error) {
    res.status(500).send()
  }

})

userRoute.post("/login", findUser, async (req, res) => {
  const user = req.user

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send({
        userName: user.userName,
        email: user.email
      })
    } else {
      res.status(400).send({ error: "E-mail or password incorrect!"})
    } 
  } catch (error) {
    res.status(500).send()
  }

})

userRoute.patch("/update", findUser, async (req, res) => {
  const user = req.user

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      usersRepository.uptade(req.body)
    } else {
      res.status(400).send({ error: "E-mail or password incorrect!"})
    } 
  } catch (error) {
    res.status(500).send()
  }

  res.send()
})

module.exports = userRoute