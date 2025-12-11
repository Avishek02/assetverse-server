const express = require("express")
const { upsertUser, checkUserExists } = require("../controllers/auth.controller")

const router = express.Router()

router.get("/user-exists", checkUserExists)
router.post("/upsert-user", upsertUser)

module.exports = router
