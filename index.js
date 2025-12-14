require("dotenv").config()
const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const connectDB = require("./config/db")
const authRoutes = require("./routes/auth.routes")
const assetRoutes = require("./routes/asset.routes")

const requestRoutes = require("./routes/request.routes")
const assignedRoutes = require("./routes/assigned.routes")
const employeeRoutes = require("./routes/employee.routes")
const teamRoutes = require("./routes/team.routes")
const userRoutes = require("./routes/user.routes")

const analyticsRoutes = require("./routes/analytics.routes")
const paymentRoutes = require("./routes/payment.routes")
const packageRoutes = require("./routes/package.routes")

const noticeRoutes = require("./routes/notice.routes")
const affiliationRoutes = require("./routes/affiliation.routes")







const app = express()
app.use(cors({
  origin: [
    process.env.CLIENT_ORIGIN_LOCAL,
    process.env.CLIENT_ORIGIN_PROD
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));






app.use(express.json())
app.use(cookieParser())

app.use("/api/requests", requestRoutes)
app.use("/api/assets", assetRoutes)
app.use("/api/auth", authRoutes)

app.use("/api/assigned-assets", assignedRoutes)
app.use("/api/employees", employeeRoutes)
app.use("/api/teams", teamRoutes)
app.use("/api/users", userRoutes)
app.use("/api/analytics", analyticsRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/packages", packageRoutes)
app.use("/api/notices", noticeRoutes)
app.use("/api/affiliations", affiliationRoutes)







app.get("/", (req, res) => {
  res.send("AssetVerse server is running")
})




const port = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
})
