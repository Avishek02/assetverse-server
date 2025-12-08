const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    role: { type: String, enum: ["employee", "hr"], required: true },
    companyName: String,
    companyLogo: String,
    packageLimit: { type: Number, default: 0 },
    currentEmployees: { type: Number, default: 0 },
    subscription: String,
    dateOfBirth: Date,
    profileImage: String,
  },
  { timestamps: true }
)

const User = mongoose.model("User", userSchema)

module.exports = User
