const express = require('express')
const router = express.Router()
const chatController = require('../controllers/chatController')

router.post("/", chatController.create)
router.get("/", chatController.getAll)
router.get("/:id", chatController.getOne)
router.put("/:id", chatController.update)
router.delete("/:id", chatController.delete)

module.exports = router; 