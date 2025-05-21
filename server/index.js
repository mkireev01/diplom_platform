require('dotenv').config();
const express = require('express');
const http = require('http');                   
const cors = require('cors');
const sequelize = require('./db');
const models = require('./models/models');
const router = require('./routers/index');
const setupSocket = require('./socket/socket');         

const app = express();
const server = http.createServer(app);           
const PORT = process.env.PORT || 5000;

const io = require('socket.io')(server, {        
  cors: {
    origin: '*',                                 
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());
app.use('/api', router);


setupSocket(io);                                 


const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.error('Ошибка запуска сервера:', e);
  }
};

start();
