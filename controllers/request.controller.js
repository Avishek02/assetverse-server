const Asset = require("../models/Asset")
const User = require("../models/User")
const Request = require("../models/Request")
const EmployeeAffiliation = require("../models/EmployeeAffiliation")
const AssignedAsset = require("../models/AssignedAsset")

const createRequest = async (req, res) => {
  try {
    const { assetId, note } = req.body
    const requesterEmail = req.user.email

    const employee = await User.findOne({ email: requesterEmail, role: "employee" })
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" })
    }

    const asset = await Asset.findById(assetId)
    if (!asset || asset.availableQuantity <= 0) {
      return res.status(400).json({ message: "Asset not available" })
    }

    const hrUser = await User.findOne({ email: asset.hrEmail, role: "hr" })
    if (!hrUser) {
      return res.status(404).json({ message: "HR user not found" })
    }

    const request = await Request.create({
      assetId: asset._id,
      assetName: asset.productName,
      assetType: asset.productType,
      requesterName: employee.name,
      requesterEmail,
      hrEmail: asset.hrEmail,
      companyName: asset.companyName,
      note: note || "",
    })

    res.status(201).json(request)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

const getHrRequests = async (req, res) => {
  try {
    const hrEmail = req.user.email

    const requests = await Request.find({ hrEmail }).sort({ createdAt: -1 })

    res.json(requests)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

const approveRequest = async (req, res) => {
  try {
    const { id } = req.params
    const hrEmail = req.user.email

    const request = await Request.findOne({ _id: id, hrEmail })
    if (!request) {
      return res.status(404).json({ message: "Request not found" })
    }
    if (request.requestStatus !== "pending") {
      return res.status(400).json({ message: "Request already processed" })
    }

    const hrUser = await User.findOne({ email: hrEmail, role: "hr" })
    if (!hrUser) {
      return res.status(404).json({ message: "HR not found" })
    }

    const existingAffiliation = await EmployeeAffiliation.findOne({
      employeeEmail: request.requesterEmail,
      hrEmail,
      status: "active",
    })

    if (!existingAffiliation) {
      if (hrUser.currentEmployees >= hrUser.packageLimit) {
        return res.status(400).json({ message: "Package limit reached" })
      }

      await EmployeeAffiliation.create({
        employeeEmail: request.requesterEmail,
        employeeName: request.requesterName,
        hrEmail,
        companyName: hrUser.companyName,
        companyLogo: hrUser.companyLogo || "",
      })

      hrUser.currentEmployees += 1
      await hrUser.save()
    }

    const asset = await Asset.findById(request.assetId)
    if (!asset || asset.availableQuantity <= 0) {
      return res.status(400).json({ message: "Asset not available" })
    }
    asset.availableQuantity -= 1
    await asset.save()

    await AssignedAsset.create({
      assetId: asset._id,
      assetName: asset.productName,
      assetImage: asset.productImage,
      assetType: asset.productType,
      employeeEmail: request.requesterEmail,
      employeeName: request.requesterName,
      hrEmail,
      companyName: asset.companyName,
    })

    request.requestStatus = "approved"
    request.approvalDate = new Date()
    request.processedBy = hrEmail
    await request.save()

    res.json({ message: "Request approved" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

const rejectRequest = async (req, res) => {
  try {
    const { id } = req.params
    const hrEmail = req.user.email

    const request = await Request.findOne({ _id: id, hrEmail })
    if (!request) {
      return res.status(404).json({ message: "Request not found" })
    }
    if (request.requestStatus !== "pending") {
      return res.status(400).json({ message: "Request already processed" })
    }

    request.requestStatus = "rejected"
    request.processedBy = hrEmail
    await request.save()

    res.json({ message: "Request rejected" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = { createRequest, getHrRequests, approveRequest, rejectRequest }
