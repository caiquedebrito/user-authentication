const { Schema, model, SchemaTypes } = require("mongoose")

const refreshTokenSchema = new Schema({
  refreshToken: {
    type: String,
    required: true
  },
  userData: {
    id: {
      type: SchemaTypes.ObjectId,
      required: true,
      ref: "User"
    },
    userName: {
      type: String,
      required: true
    },
    isPrivate: {
      type: Boolean,
      required: true
    },
  }
})

module.exports = RefreshToken = new model("RefreshToken", refreshTokenSchema)