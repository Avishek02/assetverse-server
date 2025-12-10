const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema(
  {
    hrEmail: { type: String, required: true },
    packageName: { type: String, required: true },
    employeeLimit: { type: Number, required: true },
    amount: { type: Number, required: true },
    transactionId: { type: String, required: true },
    paymentDate: { type: Date },
    status: {
      type: String,
      enum: ["completed", "failed", "pending"],
      default: "pending",
    },
  },
  { timestamps: true }
)

const Payment = mongoose.model("Payment", paymentSchema)

module.exports = Payment
