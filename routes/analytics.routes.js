const express = require("express")
const { verifyToken, verifyHR } = require("../middlewares/auth.middleware")
const { getAssetTypeDistribution, getTopRequestedAssets } = require("../controllers/analytics.controller")

const router = express.Router()

router.get("/asset-types", verifyToken, verifyHR, getAssetTypeDistribution)
router.get("/top-requested-assets", verifyToken, verifyHR, getTopRequestedAssets)

module.exports = router
