const express = require('express')
const router = express.Router()
const companyController = require("../controllers/companyController")
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')
const resumeController = require('../controllers/resumeController')

router.post("/", checkRoleMiddleware("seeker"), resumeController.create)
router.get("/", resumeController.getAll)
router.get("/:id", resumeController.getOne)
router.put("/:id", resumeController.update)
router.delete("/:id", resumeController.delete)

module.exports = router
