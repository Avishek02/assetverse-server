const AssignedAsset = require("../models/AssignedAsset")

const getEmployeeAssets = async (req, res) => {
  try {
    const email = req.user.email
    const assets = await AssignedAsset.find({ employeeEmail: email }).sort({ createdAt: -1 })
    res.json(assets)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = { getEmployeeAssets }
