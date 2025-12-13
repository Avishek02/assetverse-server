const express = require("express")
const { verifyToken } = require("../middlewares/auth.middleware")
const { updateMe, getMe } = require("../controllers/user.controller")

const router = express.Router()

router.patch("/me", verifyToken, updateMe)
router.get("/me", verifyToken, getMe)

module.exports = router
