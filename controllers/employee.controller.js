const EmployeeAffiliation = require("../models/EmployeeAffiliation")
const AssignedAsset = require("../models/AssignedAsset")

const getHrEmployees = async (req, res) => {
  try {
    const hrEmail = req.user.email

    const affiliations = await EmployeeAffiliation.find({
      hrEmail,
      status: "active",
    }).sort({ createdAt: -1 })

    const emails = affiliations.map(a => a.employeeEmail)

    const assetCounts = await AssignedAsset.aggregate([
      { $match: { hrEmail, employeeEmail: { $in: emails }, status: "assigned" } },
      { $group: { _id: "$employeeEmail", count: { $sum: 1 } } },
    ])

    const countMap = {}
    assetCounts.forEach(a => {
      countMap[a._id] = a.count
    })

    const result = affiliations.map(a => ({
      id: a._id,
      employeeName: a.employeeName,
      employeeEmail: a.employeeEmail,
      companyName: a.companyName,
      companyLogo: a.companyLogo,
      affiliationDate: a.affiliationDate,
      assetsCount: countMap[a.employeeEmail] || 0,
    }))

    res.json(result)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = { getHrEmployees }
