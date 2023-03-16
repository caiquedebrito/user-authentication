const Router = require("express").Router
const UserController = require("../controllers/UserController")
const authenticateUser = require("../middlewares/authenticateUser")

const userRoute = Router()

// todo: limitar a quantidade de request por tempo
userRoute.get("/", authenticateUser, UserController.getAllUser)

userRoute.post("/", UserController.createUser)

userRoute.post("/login", UserController.getUser)

userRoute.patch("/update", authenticateUser, UserController.uptadeUser)

userRoute.delete("/delete", authenticateUser, UserController.deleteUser)

userRoute.get("/refresh", UserController.getToken)

module.exports = userRoute