const { Chat, User } = require('../models/models');
const { Op } = require('sequelize');

class ChatController {

  async create(req, res) {
    console.log('body:', req.body);
    const { seekerId, employerId } = req.body;

    try {
      let chat = await Chat.findOne({
        where: { seekerId, employerId }
      });

      if (!chat) {
        chat = await Chat.create({ seekerId, employerId });
      }

      res.status(201).json(chat);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Получить все чаты пользователя
  async getAll(req, res) {
    const { userId } = req.params;

    try {
      const chats = await Chat.findAll({
        where: {
          [Op.or]: [
            { seekerId: userId },
            { employerId: userId }
          ]
        },
        include: [
          { model: User, as: 'seeker', attributes: ['id', 'firstName', 'lastName'] },
          { model: User, as: 'employer', attributes: ['id', 'firstName', 'lastName'] }
        ]
      });

      res.json(chats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Получить один чат по ID
  async getOne(req, res) {
    try {
      const chat = await Chat.findByPk(req.params.id, {
        include: [
          { model: User, as: 'seeker', attributes: ['id', 'firstName', 'lastName'] },
          { model: User, as: 'employer', attributes: ['id', 'firstName', 'lastName'] }
        ]
      });

      if (!chat) return res.status(404).json({ error: 'Чат не найден' });

      res.json(chat);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Обновить чат (необязательная функция, обычно не используется)
  async update(req, res) {
    try {
      const [updated] = await Chat.update(req.body, {
        where: { id: req.params.id }
      });

      if (!updated) return res.status(404).json({ error: 'Чат не найден' });

      const updatedChat = await Chat.findByPk(req.params.id);
      res.json(updatedChat);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Удалить чат
  async delete(req, res) {
    try {
      const deleted = await Chat.destroy({
        where: { id: req.params.id }
      });

      if (!deleted) return res.status(404).json({ error: 'Чат не найден' });

      res.json({ message: 'Чат удалён' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new ChatController();
