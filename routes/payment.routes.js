const express = require("express")
const { verifyToken, verifyHR } = require("../middlewares/auth.middleware")
const { createCheckoutSession, confirmPayment } = require("../controllers/payment.controller")

const router = express.Router()

router.post("/create-checkout-session", verifyToken, verifyHR, createCheckoutSession)
router.post("/confirm", verifyToken, verifyHR, confirmPayment)

module.exports = router
