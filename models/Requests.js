const mongoose = require("mongoose")

const requestSchema = new mongoose.Schema(
  {
    assetId: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
    assetName: { type: String, required: true },
    assetType: { type: String, required: true },
    requesterName: { type: String, required: true },
    requesterEmail: { type: String, required: true },
    hrEmail: { type: String, required: true },
    companyName: { type: String, required: true },
    requestDate: { type: Date, default: Date.now },
    approvalDate: { type: Date },
    requestStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "returned"],
      default: "pending",
    },
    note: String,
    processedBy: String,
  },
  { timestamps: true }
)

const Request = mongoose.model("Request", requestSchema)

module.exports = Request
