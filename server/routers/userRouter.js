const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController');
const authMiddleware = require("../middleware/authMiddleware")

router.post("/registration", userController.registration)
router.post("/login", userController.login)
router.get("/auth", authMiddleware, userController.check)
router.get('/', userController.getAllUsers);
router.get("/:id", userController.getOne)
router.delete('/:id', userController.delete)

module.exports = router; 