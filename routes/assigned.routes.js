const express = require("express")
const { verifyToken } = require("../middlewares/auth.middleware")
const { getEmployeeAssets } = require("../controllers/assigned.controller")

const router = express.Router()

router.get("/", verifyToken, getEmployeeAssets)

module.exports = router
