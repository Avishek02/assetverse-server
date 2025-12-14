const express = require("express")
const { verifyToken, verifyHR } = require("../middlewares/auth.middleware")
const { getAssetTypeDistribution, getTopRequestedAssets, getHROverview } = require("../controllers/analytics.controller")

const router = express.Router()

router.get("/asset-types", verifyToken, verifyHR, getAssetTypeDistribution)
router.get("/top-requested-assets", verifyToken, verifyHR, getTopRequestedAssets)
router.get("/hr/overview", verifyToken, verifyHR, getHROverview)


module.exports = router
