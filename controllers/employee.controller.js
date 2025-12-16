const EmployeeAffiliation = require("../models/EmployeeAffiliation")
const AssignedAsset = require("../models/AssignedAsset")
const Asset = require("../models/Asset")
const User = require("../models/User")
const Request = require("../models/Request")

const getHrEmployees = async (req, res) => {
  try {
    const hrEmail = req.user.email

    const affiliations = await EmployeeAffiliation.find({
      hrEmail,
      status: "active",
    })
      .sort({ createdAt: -1 })
      .lean()

    const emails = affiliations.map(a => a.employeeEmail).filter(Boolean)

    const assetCounts = await AssignedAsset.aggregate([
      { $match: { hrEmail, employeeEmail: { $in: emails }, status: "assigned" } },
      { $group: { _id: "$employeeEmail", count: { $sum: 1 } } },
    ])

    const countMap = {}
    assetCounts.forEach(a => {
      countMap[a._id] = a.count
    })

    const users = await User.find({ email: { $in: emails } })
      .select("email name profileImage")
      .lean()

    const userMap = new Map(users.map(u => [u.email, u]))

    const result = affiliations.map(a => {
      const u = userMap.get(a.employeeEmail)
      return {
        id: a._id,
        employeeName: a.employeeName || u?.name || "",
        employeeEmail: a.employeeEmail,
        companyName: a.companyName,
        companyLogo: a.companyLogo,
        affiliationDate: a.affiliationDate,
        assetsCount: countMap[a.employeeEmail] || 0,
        profileImage: u?.profileImage || null,
      }
    })

    res.json(result)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

const removeEmployee = async (req, res) => {
  try {
    const hrEmail = req.user.email
    const { employeeEmail } = req.params

    const affiliation = await EmployeeAffiliation.findOne({
      hrEmail,
      employeeEmail,
      status: "active",
    })

    if (!affiliation) {
      return res.status(404).json({ message: "Employee not affiliated" })
    }

    const assigned = await AssignedAsset.find({
      hrEmail,
      employeeEmail,
      status: "assigned",
    })

    for (const item of assigned) {
      const asset = await Asset.findById(item.assetId)
      if (asset) {
        asset.availableQuantity += 1
        await asset.save()
      }
      item.status = "returned"
      item.returnDate = new Date()
      await item.save()
    }

    await Request.updateMany(
      {
        hrEmail,
        requesterEmail: employeeEmail,
        requestStatus: "approved",
      },
      {
        $set: {
          requestStatus: "returned",
          approvalDate: new Date(),
        },
      }
    )

    affiliation.status = "inactive"
    await affiliation.save()

    const hrUser = await User.findOne({ email: hrEmail })
    if (hrUser.currentEmployees > 0) {
      hrUser.currentEmployees -= 1
      await hrUser.save()
    }

    res.json({ message: "Employee removed and assets returned" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = { getHrEmployees, removeEmployee }
