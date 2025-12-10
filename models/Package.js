const mongoose = require("mongoose")

const packageSchema = new mongoose.Schema(
  {
    name: String,
    employeeLimit: Number,
    price: Number,
    features: [String],
  },
  { timestamps: true }
)

const Package = mongoose.model("Package", packageSchema)

module.exports = Package
