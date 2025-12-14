const express = require("express")
const { verifyToken } = require("../middlewares/auth.middleware")
const { getMyAffiliations } = require("../controllers/affiliation.controller")

const router = express.Router()

router.get("/me", verifyToken, getMyAffiliations)

module.exports = router
