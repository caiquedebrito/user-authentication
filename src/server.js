require('dotenv').config()
const express = require("express")
const cors = require("cors")
const useRoute = require("./routes/user.routes")
require("./db/index")

const app = express()

app.use(cors())
app.use(express.json())
app.use("/users", useRoute)

app.listen(3333)