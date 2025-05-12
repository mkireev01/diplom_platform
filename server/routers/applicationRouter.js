const express = require('express')
const router = express.Router()
const applicationController = require("../controllers/applicationController")

router.post("/", applicationController.create)
router.get("/", applicationController.getAll)
router.get("/:id", applicationController.getOne)
router.put("/:id", applicationController.update)
router.delete("/:id", applicationController.delete)

module.exports = router; 