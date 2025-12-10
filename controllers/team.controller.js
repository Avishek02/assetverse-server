const EmployeeAffiliation = require("../models/EmployeeAffiliation")
const User = require("../models/User")

const getEmployeeTeams = async (req, res) => {
  try {
    const email = req.user.email

    const myAffiliations = await EmployeeAffiliation.find({
      employeeEmail: email,
      status: "active",
    })

    if (!myAffiliations.length) {
      return res.json([])
    }

    const hrEmails = myAffiliations.map(a => a.hrEmail)

    const allAffiliations = await EmployeeAffiliation.find({
      hrEmail: { $in: hrEmails },
      status: "active",
    })

    const colleagueEmails = [...new Set(allAffiliations.map(a => a.employeeEmail))]

    const users = await User.find({ email: { $in: colleagueEmails } })

    const userMap = {}
    users.forEach(u => {
      userMap[u.email] = u
    })

    const now = new Date()
    const currentMonth = now.getMonth()

    const teams = myAffiliations.map(aff => {
      const companyAffiliations = allAffiliations.filter(a => a.hrEmail === aff.hrEmail)

      const colleagues = companyAffiliations.map(a => {
        const u = userMap[a.employeeEmail]
        return {
          name: u?.name || a.employeeName,
          email: a.employeeEmail,
          profileImage: u?.profileImage || "",
          dateOfBirth: u?.dateOfBirth || null,
        }
      })

      const upcomingBirthdays = colleagues.filter(c => {
        if (!c.dateOfBirth) return false
        const d = new Date(c.dateOfBirth)
        return d.getMonth() === currentMonth
      })

      return {
        companyName: aff.companyName,
        companyLogo: aff.companyLogo,
        hrEmail: aff.hrEmail,
        colleagues,
        upcomingBirthdays,
      }
    })

    res.json(teams)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = { getEmployeeTeams }
