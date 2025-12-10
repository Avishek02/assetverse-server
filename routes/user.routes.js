const express = require("express")
const { verifyToken } = require("../middlewares/auth.middleware")
const { updateMe } = require("../controllers/user.controller")

const router = express.Router()

router.patch("/me", verifyToken, updateMe)

module.exports = router
