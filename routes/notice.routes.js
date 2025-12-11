const express = require("express")
const { verifyToken, verifyHR } = require("../middlewares/auth.middleware")
const { createNotice, getEmployeeNotices } = require("../controllers/notice.controller")

const router = express.Router()

router.post("/", verifyToken, verifyHR, createNotice)
router.get("/employee", verifyToken, getEmployeeNotices)

module.exports = router
