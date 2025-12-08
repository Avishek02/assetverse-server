const jwt = require("jsonwebtoken")
const User = require("../models/User")

const generateToken = payload => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" })
}

const upsertUser = async (req, res) => {
  const { name, email, role, companyName, companyLogo, dateOfBirth } = req.body

  if (!email) {
    return res.status(400).json({ message: "Email is required" })
  }

  try {
    let user = await User.findOne({ email })

    if (!user) {
      if (!role) {
        return res.status(400).json({ message: "Role is required for new user" })
      }

      const payload = {
        name,
        email,
        role,
        dateOfBirth,
      }

      if (role === "hr") {
        payload.companyName = companyName
        payload.companyLogo = companyLogo
        payload.packageLimit = 5
        payload.currentEmployees = 0
        payload.subscription = "basic"
      }

      user = await User.create(payload)
    } else {
      if (name && !user.name) user.name = name
      if (dateOfBirth && !user.dateOfBirth) user.dateOfBirth = dateOfBirth
      await user.save()
    }

    const token = generateToken({ email: user.email, role: user.role })

    res.json({ user, token })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = { upsertUser }
