const mongoose = require("mongoose")

const employeeAffiliationSchema = new mongoose.Schema(
  {
    employeeEmail: { type: String, required: true },
    employeeName: { type: String, required: true },
    hrEmail: { type: String, required: true },
    companyName: { type: String, required: true },
    companyLogo: { type: String, required: true },
    affiliationDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
)

const EmployeeAffiliation = mongoose.model("EmployeeAffiliation", employeeAffiliationSchema)

module.exports = EmployeeAffiliation
