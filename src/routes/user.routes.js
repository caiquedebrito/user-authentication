const Router = require("express").Router
const UserController = require("../controllers/UserController")

const userRoute = Router()

userRoute.get("/", UserController.getAllUser)

userRoute.post("/", UserController.createUser)

userRoute.post("/login", UserController.getUser)

userRoute.patch("/update", UserController.uptadeUser)

userRoute.delete("/delete", UserController.deleteUser)

module.exports = userRoute