const { Schema, model } = require("mongoose")

const userSchema = new Schema({

  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minLength: 8
  },
  isPrivate: {
    type: Boolean,
    required: true
  }

})

module.exports = User = new model("User", userSchema)