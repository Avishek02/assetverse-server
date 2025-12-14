const EmployeeAffiliation = require("../models/EmployeeAffiliation")

const getMyAffiliations = async (req, res) => {
  try {
    const email = req.user.email
    const affiliations = await EmployeeAffiliation.find({
      employeeEmail: email,
      status: "active",
    }).sort({ affiliationDate: -1 })

    res.json(affiliations)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = { getMyAffiliations }
