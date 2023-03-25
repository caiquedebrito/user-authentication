const Router = require("express").Router
const rateLimit = require("express-rate-limit")
const UserController = require("../controllers/UserController")
const authenticateUser = require("../middlewares/authenticateUser")

const userRoute = Router()

const createUserLimitter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
	max: 1, // Limit each IP to 1 create account requests per `window` (here, per hour)
	message: {
		error: {
			message: 'Too many accounts created from this IP, please try again after an hour'
		}
	},
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const updateUserLimitter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	max: 3,
	message: {
		error: {
			message: 'Too many accounts updated from this IP, please try again after an hour'
		}
	},
	standardHeaders: true,
	legacyHeaders: false
})

userRoute.get("/", authenticateUser, UserController.getAllUser)

userRoute.post("/", createUserLimitter, UserController.createUser)

userRoute.post("/login", UserController.getUser)
userRoute.post("/logout", UserController.logout)

userRoute.patch("/update", updateUserLimitter, authenticateUser, UserController.uptadeUser)

userRoute.delete("/delete", authenticateUser, UserController.deleteUser)

userRoute.post("/refresh", UserController.getToken)

module.exports = userRoute