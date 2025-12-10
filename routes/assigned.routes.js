const express = require("express")
const { verifyToken } = require("../middlewares/auth.middleware")
const { getEmployeeAssets, returnAsset } = require("../controllers/assigned.controller")

const router = express.Router()

router.get("/", verifyToken, getEmployeeAssets)
router.patch("/:id/return", verifyToken, returnAsset)

module.exports = router
