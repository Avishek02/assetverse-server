const express = require("express")
const { verifyToken } = require("../middlewares/auth.middleware")
const { getEmployeeTeams } = require("../controllers/team.controller")

const router = express.Router()

router.get("/", verifyToken, getEmployeeTeams)

module.exports = router
