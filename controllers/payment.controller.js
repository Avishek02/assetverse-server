const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const Payment = require("../models/Payment")
const User = require("../models/User")
const Package = require("../models/Package")

const createCheckoutSession = async (req, res) => {
  try {
    const hrEmail = req.user.email
    const { packageName } = req.body

    const hrUser = await User.findOne({ email: hrEmail, role: "hr" })
    if (!hrUser) {
      return res.status(404).json({ message: "HR not found" })
    }

    const pkg = await Package.findOne({ name: packageName })
    if (!pkg) {
      return res.status(400).json({ message: "Invalid package" })
    }

    const realPrice = pkg.price
    const realLimit = pkg.employeeLimit
    const amountInCents = realPrice * 100

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${pkg.name} package`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      customer_email: hrEmail,
      success_url: `${process.env.CLIENT_ORIGIN_PROD}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_ORIGIN_PROD}/dashboard/hr/upgrade`,
    })

    await Payment.create({
      hrEmail,
      packageName: pkg.name,
      employeeLimit: realLimit,
      amount: amountInCents,
      transactionId: session.id,
      status: "pending",
    })

    res.json({ url: session.url })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

const confirmPayment = async (req, res) => {
  try {
    const { sessionId } = req.body
    const hrEmail = req.user.email

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" })
    }

    const payment = await Payment.findOne({ transactionId: session.id, hrEmail })
    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" })
    }

    payment.status = "completed"
    payment.paymentDate = new Date()
    await payment.save()

    const hrUser = await User.findOne({ email: hrEmail, role: "hr" })
    if (!hrUser) {
      return res.status(404).json({ message: "HR not found" })
    }

    hrUser.subscription = payment.packageName.toLowerCase()
    hrUser.packageLimit = payment.employeeLimit
    await hrUser.save()

    res.json({ message: "Payment confirmed and package updated" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = { createCheckoutSession, confirmPayment }
