const express = require('express');
const router  = express.Router({ mergeParams: true });
const MessageController = require('../controllers/messageController');

router.get   ('/',       MessageController.getAll);  
router.post  ('/',       MessageController.create);    
router.delete('/:id',    MessageController.delete);    

module.exports = router;
