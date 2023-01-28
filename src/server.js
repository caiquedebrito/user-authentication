const express = require("express")
const useRoute = require("./routes/user.routes")

const app = express()

app.use(express.json())
app.use("/users", useRoute)

app.listen(3333)