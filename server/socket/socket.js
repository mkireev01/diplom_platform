
const { Message, Chat } = require('../models/models')

function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log('Пользователь подключен:', socket.id);

    
    socket.on('join_chat', (chatId) => {
      socket.join(`chat_${chatId}`);
      console.log(`Пользователь вошел в чат: chat_${chatId}`);
    });

    // Получено сообщение
    socket.on('send_message', async (data) => {
      const { chatId, senderId, content } = data;

      try {
        const message = await Message.create({ chatId, senderId, content });

        io.to(`chat_${chatId}`).emit('new_message', message);
      } catch (err) {
        console.error('Ошибка при сохранении сообщения:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('Пользователь отключился:', socket.id);
    });
  });
}

module.exports = setupSocket;
