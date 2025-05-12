const { Chat } = require('../models/models');

class ChatController {
  async create(req, res) {
    try {
      const chat = await Chat.create(req.body);
      res.status(201).json(chat);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async getAll(req, res) {
    try {
      const chats = await Chat.findAll();
      res.json(chats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getOne(req, res) {
    try {
      const chat = await Chat.findByPk(req.params.id);
      if (!chat) return res.status(404).json({ error: 'Chat not found' });
      res.json(chat);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const [updated] = await Chat.update(req.body, { where: { id: req.params.id } });
      if (!updated) return res.status(404).json({ error: 'Chat not found' });
      const updatedChat = await Chat.findByPk(req.params.id);
      res.json(updatedChat);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      const deleted = await Chat.destroy({ where: { id: req.params.id } });
      if (!deleted) return res.status(404).json({ error: 'Chat not found' });
      res.json({ message: 'Chat deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new ChatController();