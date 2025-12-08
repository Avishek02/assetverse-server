const express = require("express")
const { upsertUser } = require("../controllers/auth.controller")

const router = express.Router()

router.post("/upsert-user", upsertUser)

module.exports = router
