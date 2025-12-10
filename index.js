require("dotenv").config()
const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const connectDB = require("./config/db")
const authRoutes = require("./routes/auth.routes")
const assetRoutes = require("./routes/asset.routes")

const requestRoutes = require("./routes/request.routes")


const app = express()

app.use("/api/requests", requestRoutes)


app.use(
  cors({
    origin: [
      process.env.CLIENT_ORIGIN_LOCAL,
      process.env.CLIENT_ORIGIN_PROD
    ],
    credentials: true,
  })
)

app.use(express.json())
app.use(cookieParser())
app.use("/api/assets", assetRoutes)


app.get("/", (req, res) => {
  res.send("AssetVerse server is running")
})

app.use("/api/auth", authRoutes)

const port = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
})
