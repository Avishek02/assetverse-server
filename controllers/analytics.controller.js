const Asset = require("../models/Asset")
const Request = require("../models/Request")

const getAssetTypeDistribution = async (req, res) => {
  try {
    const hrEmail = req.user.email

    const assets = await Asset.aggregate([
      { $match: { hrEmail } },
      {
        $group: {
          _id: "$productType",
          count: { $sum: 1 },
        },
      },
    ])

    const mapped = assets.map(a => ({
      type: a._id,
      count: a.count,
    }))

    res.json(mapped)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

const getTopRequestedAssets = async (req, res) => {
  try {
    const hrEmail = req.user.email

    const requested = await Request.aggregate([
      { $match: { hrEmail } },
      {
        $group: {
          _id: "$assetName",
          requests: { $sum: 1 },
        },
      },
      { $sort: { requests: -1 } },
      { $limit: 5 },
    ])

    const mapped = requested.map(r => ({
      assetName: r._id,
      requests: r.requests,
    }))

    res.json(mapped)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = { getAssetTypeDistribution, getTopRequestedAssets }
