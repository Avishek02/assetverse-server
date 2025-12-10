const express = require("express")
const { createRequest, getHrRequests, approveRequest, rejectRequest } = require("../controllers/request.controller")
const { verifyToken, verifyHR } = require("../middlewares/auth.middleware")

const router = express.Router()

router.post("/", verifyToken, createRequest)
router.get("/hr", verifyToken, verifyHR, getHrRequests)
router.patch("/:id/approve", verifyToken, verifyHR, approveRequest)
router.patch("/:id/reject", verifyToken, verifyHR, rejectRequest)

module.exports = router
