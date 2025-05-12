const express = require('express')
const router = express.Router()
const messageController = require('../controllers/messageController')

router.post('/', (req, res) => messageController.create(req, res))
router.get('/', (req, res) => messageController.getAll(req, res))
router.get('/:id', (req, res) => messageController.getOne(req, res))
router.delete('/:id', (req, res) => messageController.delete(req, res))

module.exports = router;