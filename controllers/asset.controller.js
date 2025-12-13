const Asset = require("../models/Asset")
const User = require("../models/User")
const AssignedAsset = require("../models/AssignedAsset")
const EmployeeAffiliation = require("../models/EmployeeAffiliation")

const createAsset = async (req, res) => {
  try {
    const { productName, productImage, productType, productQuantity } = req.body
    const hrEmail = req.user.email

    const hrUser = await User.findOne({ email: hrEmail, role: "hr" })
    if (!hrUser) {
      return res.status(404).json({ message: "HR user not found" })
    }

    const asset = await Asset.create({
      productName,
      productImage,
      productType,
      productQuantity,
      availableQuantity: productQuantity,
      hrEmail,
      companyName: hrUser.companyName,
    })

    res.status(201).json(asset)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

const getHrAssets = async (req, res) => {
  try {
    const hrEmail = req.user.email
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const search = req.query.search || ""

    const query = {
      hrEmail,
      productName: { $regex: search, $options: "i" },
    }

    const total = await Asset.countDocuments(query)
    const assets = await Asset.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    res.json({
      data: assets,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

const deleteAsset = async (req, res) => {
  try {
    const { id } = req.params
    const hrEmail = req.user.email

    const asset = await Asset.findOneAndDelete({ _id: id, hrEmail })
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" })
    }

    res.json({ message: "Asset deleted" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = { createAsset, getHrAssets, deleteAsset }


const getAvailableAssetsForEmployees = async (req, res) => {
  try {
    const search = req.query.search || ""

    const query = {
      availableQuantity: { $gt: 0 },
      productName: { $regex: search, $options: "i" },
    }

    const assets = await Asset.find(query).sort({ createdAt: -1 })

    res.json(assets)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}




const directAssignAsset = async (req, res) => {
  try {
    const hrEmail = req.user.email
    const { assetId } = req.params
    const { employeeEmail } = req.body

    const affiliation = await EmployeeAffiliation.findOne({
      hrEmail,
      employeeEmail,
      status: "active",
    })

    if (!affiliation) {
      return res.status(403).json({ message: "Employee not affiliated" })
    }

    const asset = await Asset.findOne({ _id: assetId, hrEmail })
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" })
    }

    if (asset.availableQuantity <= 0) {
      return res.status(400).json({ message: "Asset out of stock" })
    }

    asset.availableQuantity -= 1
    await asset.save()

    const assigned = await AssignedAsset.create({
      assetId: asset._id,
      assetName: asset.productName,
      assetImage: asset.productImage,
      assetType: asset.productType,
      employeeEmail,
      employeeName: affiliation.employeeName,
      hrEmail,
      companyName: asset.companyName,
      assignmentDate: new Date(),
      returnDate: null,
      status: "assigned",
    })

    res.status(201).json(assigned)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}


module.exports = { createAsset, getHrAssets, deleteAsset, getAvailableAssetsForEmployees, directAssignAsset }

