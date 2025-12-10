const Asset = require("../models/Asset")
const User = require("../models/User")

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



