require('dotenv').config()
const express = require("express")
const useRoute = require("./routes/user.routes")
require("./db/index")

const app = express()

app.use(express.json())
app.use("/users", useRoute)

app.listen(3333)