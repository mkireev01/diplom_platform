const { Message, User } = require('../models/models');

class MessageController {
 
  async getAll(req, res) {
    const { chatId } = req.params;

    try {
      const messages = await Message.findAll({
        where: { chatId },
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName']
          }
        ],
        order: [['createdAt', 'ASC']]
      });

      res.json(messages);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }


  // messageController.js
  async create(req, res) {
    // chatId приходит не в body, а в URL-параметре
    const { chatId } = req.params;
    const { senderId, content } = req.body;

    try {
      const message = await Message.create({
        chatId,      // теперь не undefined
        senderId,
        content
      });
      return res.json(message);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }


  
  async getOne(req, res) {
    try {
      const message = await Message.findByPk(req.params.id, {
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName']
          }
        ]
      });

      if (!message) return res.status(404).json({ error: 'Сообщение не найдено' });

      res.json(message);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

 
  async delete(req, res) {
    try {
      const deleted = await Message.destroy({
        where: { id: req.params.id }
      });

      if (!deleted) return res.status(404).json({ error: 'Сообщение не найдено' });

      res.json({ message: 'Сообщение удалено' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new MessageController();
