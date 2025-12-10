const express = require("express")
const { createAsset, getHrAssets, deleteAsset, getAvailableAssetsForEmployees } = require("../controllers/asset.controller")

const { verifyToken, verifyHR } = require("../middlewares/auth.middleware")

const router = express.Router()

router.post("/", verifyToken, verifyHR, createAsset)
router.get("/", verifyToken, verifyHR, getHrAssets)
router.delete("/:id", verifyToken, verifyHR, deleteAsset)

router.get("/public", verifyToken, getAvailableAssetsForEmployees)


module.exports = router






