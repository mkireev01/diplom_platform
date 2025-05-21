const express = require('express');
const router  = express.Router();
const ChatController = require('../controllers/chatController');


router.post    ('/',           ChatController.create);   
router.get     ('/:userId',    ChatController.getAll);   
router.get     ('/one/:id',    ChatController.getOne);  
router.put     ('/:id',        ChatController.update);   
router.delete  ('/:id',        ChatController.delete);   
module.exports = router;
