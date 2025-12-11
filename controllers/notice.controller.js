const Notice = require("../models/Notice")
const EmployeeAffiliation = require("../models/EmployeeAffiliation")
const User = require("../models/User")

const createNotice = async (req, res) => {
  try {
    const hrEmail = req.user.email
    const { title, message, priority } = req.body

    const hrUser = await User.findOne({ email: hrEmail, role: "hr" })
    if (!hrUser) {
      return res.status(404).json({ message: "HR not found" })
    }

    const notice = await Notice.create({
      title,
      message,
      priority,
      hrEmail,
      companyName: hrUser.companyName,
    })

    res.status(201).json(notice)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

const getEmployeeNotices = async (req, res) => {
  try {
    const email = req.user.email

    const affiliations = await EmployeeAffiliation.find({
      employeeEmail: email,
      status: "active",
    })

    if (!affiliations.length) return res.json([])

    const hrEmails = affiliations.map(a => a.hrEmail)

    const notices = await Notice.find({ hrEmail: { $in: hrEmails } }).sort({ createdAt: -1 })

    res.json(notices)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = { createNotice, getEmployeeNotices }
