const express = require("express")
const { verifyToken, verifyHR } = require("../middlewares/auth.middleware")
const { getHrEmployees } = require("../controllers/employee.controller")

const router = express.Router()

router.get("/hr", verifyToken, verifyHR, getHrEmployees)

router.delete("/hr/:employeeEmail", verifyToken, verifyHR, removeEmployee)


module.exports = router
