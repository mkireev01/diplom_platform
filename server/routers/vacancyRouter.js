const express = require('express')
const router = express.Router()
const vacancyController = require("../controllers/vacancyController")
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware")

router.post("/", checkRoleMiddleware("employer"), vacancyController.create)
router.get("/", vacancyController.getAll)
router.get("/:id", vacancyController.getOne)
router.put("/:id", vacancyController.update)
router.delete("/:id", vacancyController.delete)

module.exports = router; 