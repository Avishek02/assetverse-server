const mongoose = require("mongoose")

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    hrEmail: { type: String, required: true },
    companyName: { type: String, required: true },
    priority: { type: String, enum: ["low", "medium", "high"], default: "low" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

const Notice = mongoose.model("Notice", noticeSchema)

module.exports = Notice
