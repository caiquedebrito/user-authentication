const express = require("express")
const bcrypt = require("bcrypt")


class UsersRepository {
  users = []

  getAll() {
    return this.users
  }

  create(user) {
    this.users.push(user)
  }

  get(email) {
    const user = this.users.find(user => user.email === email)

    return user
  }

  async uptade(newUserCredentials) {
    // Achar usuário
    const user = this.get(newUserCredentials.email)

    // Deletar usuário desatualizado
    this.delete(newUserCredentials.email)

    // Atualizar usuário: password ou usename (só um ou os dois)
    // verificar se foi enviado um novo userName ou um novo password

    const updatedUser = user
    if (newUserCredentials.newCredentials?.password) {
      const hashedPassword = await bcrypt.hash(newUserCredentials.newCredentials.password, 10)
      updatedUser.password = hashedPassword
    }

    if (newUserCredentials.newCredentials?.userName) {
      updatedUser.userName = newUserCredentials.newCredentials.userName
    }

    this.create(updatedUser)
  }

  delete(email) {
    this.users = this.users.filter(user => user.email !== email)
  }
}

const usersRepository = new UsersRepository()

const userRoute = express.Router()

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

userRoute.get("/", (req, res) => {
  const users = usersRepository.getAll()
  res.json(users)
})

userRoute.post("/", findEmail, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    
    const user = { userName: req.body.userName, email: req.body.email, password: hashedPassword }

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