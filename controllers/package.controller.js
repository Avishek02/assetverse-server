const Package = require("../models/Package")

const defaultPackages = [
  {
    name: "Basic",
    employeeLimit: 5,
    price: 5,
    features: ["Asset Tracking", "Employee Management", "Basic Support"],
  },
  {
    name: "Standard",
    employeeLimit: 10,
    price: 8,
    features: ["All Basic features", "Advanced Analytics", "Priority Support"],
  },
  {
    name: "Premium",
    employeeLimit: 20,
    price: 15,
    features: ["All Standard features", "Custom Branding", "24/7 Support"],
  },
]

const getPackages = async (req, res) => {
  try {
    let packages = await Package.find()
    if (!packages.length) {
      packages = await Package.insertMany(defaultPackages)
    }
    res.json(packages)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = { getPackages }
