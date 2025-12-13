const User = require("../models/User")

const getMe = async (req, res) => {
  try {
    const email = req.user.email
    const user = await User.findOne({ email }).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

const updateMe = async (req, res) => {
  try {
    const email = req.user.email
    const { name, profileImage, dateOfBirth, companyName, companyLogo } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (name) user.name = name
    if (profileImage) user.profileImage = profileImage
    if (dateOfBirth) user.dateOfBirth = dateOfBirth

    if (user.role === "hr") {
      if (companyName) user.companyName = companyName
      if (companyLogo) user.companyLogo = companyLogo
    }

    await user.save()
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = { updateMe, getMe }
