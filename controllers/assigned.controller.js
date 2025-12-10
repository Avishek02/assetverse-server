const AssignedAsset = require("../models/AssignedAsset")
const Asset = require("../models/Asset")
const Request = require("../models/Request")

const getEmployeeAssets = async (req, res) => {
  try {
    const email = req.user.email
    const assets = await AssignedAsset.find({ employeeEmail: email }).sort({ createdAt: -1 })
    res.json(assets)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

const returnAsset = async (req, res) => {
  try {
    const { id } = req.params
    const email = req.user.email

    const assigned = await AssignedAsset.findOne({ _id: id, employeeEmail: email, status: "assigned" })
    if (!assigned) {
      return res.status(404).json({ message: "Asset not found or already returned" })
    }

    assigned.status = "returned"
    assigned.returnDate = new Date()
    await assigned.save()

    const asset = await Asset.findById(assigned.assetId)
    if (asset) {
      asset.availableQuantity += 1
      await asset.save()
    }

    await Request.findOneAndUpdate(
      {
        assetId: assigned.assetId,
        requesterEmail: email,
        requestStatus: "approved",
      },
      { requestStatus: "returned" }
    )

    res.json({ message: "Asset returned successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = { getEmployeeAssets, returnAsset }
