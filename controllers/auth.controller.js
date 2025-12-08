const jwt = require("jsonwebtoken")
const User = require("../models/User")

const generateToken = payload => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" })
}

const upsertUser = async (req, res) => {
  const { name, email, role, companyName, companyLogo, dateOfBirth } = req.body

  try {
    const update = {
      name,
      role,
      dateOfBirth,
    }

    if (role === "hr") {
      update.companyName = companyName
      update.companyLogo = companyLogo
      update.packageLimit = 5
      update.currentEmployees = 0
      update.subscription = "basic"
    }

    const user = await User.findOneAndUpdate(
      { email },
      { $setOnInsert: update },
      { new: true, upsert: true }
    )

    const token = generateToken({ email: user.email, role: user.role })

    res.json({ user, token })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = { upsertUser }
