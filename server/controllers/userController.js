const bcrypt = require("bcrypt")
const {User} = require("../models/models")
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize');

const generateJwt = (id, firstName, lastName, email, role) => {
    const payload = { id, firstName, lastName, email, role };
    return jwt.sign(
        payload,
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
  
    async registration(req, res) {
        try {
          const { firstName, lastName, email, password, role } = req.body;
          // Проверка обязательных полей
          if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: "Не заполнены обязательные поля" });
          }
    
          // Проверяем, есть ли уже такой пользователь (по email или fullName)
          const existing = await User.findOne({
            where: {
              [Op.or]: [
                { email },
              ]
            }
          });
          if (existing) {
            return res.status(400).json({ error: "Такой пользователь уже существует" });
          }
    
          // Хешируем пароль
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);
    
          // Создаем пользователя
          const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: role || 'USER'
          });
    
          // Генерируем JWT-токен
          const token = generateJwt(user.id, user.fullName, user.email, user.role)
          // Возвращаем токен
          return res.status(201).json({ token });
        } catch (err) {
          console.error(err);
          return res.status(500).json({ error: "Ошибка сервера" });
        }
      }

      async login(req, res) {
        try {
          const { email, password } = req.body;
      
          // Проверка обязательных полей
         
      
          // Ищем пользователя по email
          const user = await User.findOne({ where: { email } });
          if (!user) {
            return res
              .status(400)
              .json({ error: "Такого пользователя не существует" });
          }
      
          // Сравниваем пароли
          const validPassword = await bcrypt.compare(password, user.password);
          if (!validPassword) {
            return res
              .status(400)
              .json({ error: "Неверный пароль" });
          }
      
          // Генерируем JWT (используем тот же generateJwt)
          const token = generateJwt(
            user.id,
            user.firstName,
            user.lastName,
            user.email,
            user.role
          );
      
          // Отправляем токен
          return res.json({ token });
        } catch (err) {
          console.error(err);
          return res
            .status(500)
            .json({ error: "Ошибка сервера" });
        }
      }
      

    async check(req, res, next) {
        const token = generateJwt(
            req.user.id,
            req.user.firstName,
            req.user.lastName,
            req.user.email,
            req.user.role
          );
        return res.json({token})
    }
}

module.exports = new UserController()