const { Schema, model } = require("mongoose")

const userSchema = new Schema({

  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isPrivate: {
    type: Boolean,
    required: true
  }

})

module.exports = User = new model("User", userSchema)