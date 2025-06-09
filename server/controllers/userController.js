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
    const t = await sequelize.transaction();
    try {
      const { firstName, lastName, email, password, role } = req.body;
  
      // 1) Обязательные поля
      if (!firstName || !lastName || !email || !password) {
        await t.rollback();
        return res.status(400).json({ error: "Не заполнены обязательные поля" });
      }
  
      // 2) Проверка на существующего пользователя
      const existing = await User.findOne({
        where: { [Op.or]: [{ email }] },
        transaction: t
      });
      if (existing) {
        await t.rollback();
        return res.status(400).json({ error: "Такой пользователь уже существует" });
      }
  
      // 3) Хэширование пароля
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // 4) Создание пользователя
      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role
      }, { transaction: t });
  
      console.log(`User created (id=${user.id}), now generating JWT...`);
  
      // 5) Генерация токена внутри отдельного try/catch
      let token;
      try {
        token = generateJwt(user.id, firstName, lastName, email, role);
        console.log(`JWT generated for user ${user.id}`);
      } catch (jwtErr) {
        console.error('Error generating JWT:', jwtErr);
        // откатываем транзакцию и удаляем пользователя
        await t.rollback();
        await User.destroy({ where: { id: user.id } });
        return res.status(500).json({ error: "Ошибка при генерации токена" });
      }
  
      // 6) Коммит транзакции и успешный ответ
      await t.commit();
      return res.status(201).json({ token });
  
    } catch (err) {
      // общий catch: откатываем, логируем и отвечаем 500
      await t.rollback();
      console.error('Registration failed:', err);
      return res.status(500).json({ error: "Ошибка сервера" });
    }
  }

      async login(req, res) {
        try {
          const { email, password } = req.body;
      
      
         
      
        
          const user = await User.findOne({ where: { email } });
          if (!user) {
            return res
              .status(400)
              .json({ error: "Такого пользователя не существует" });
          }
      
 
          const validPassword = await bcrypt.compare(password, user.password);
          if (!validPassword) {
            return res
              .status(400)
              .json({ error: "Неверный пароль" });
          }
      

          const token = generateJwt(
            user.id,
            user.firstName,
            user.lastName,
            user.email,
            user.role
          );
      

          return res.json({ token });
        } catch (err) {
          console.error(err);
          return res
            .status(500)
            .json({ error: "Ошибка сервера" });
        }
      }
      

      async check(req, res, next) {
        try {
          // 1) Возьмём ID из middleware (decode JWT)
          const userId = req.user.id;
    
          // 2) Подгрузим пользователя из БД, включая createdAt
          const userFromDb = await User.findByPk(userId, {
            attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'createdAt']
          });
    
          if (!userFromDb) {
            return res.status(404).json({ error: 'User not found' });
          }
    
          // 3) Сформируем новый токен (если нужно продлить срок)
          const token = generateJwt(
            userFromDb.id,
            userFromDb.firstName,
            userFromDb.lastName,
            userFromDb.email,
            userFromDb.role
          );
    
          // 4) Вернем и токен, и данные пользователя
          return res.json({
            token,
            user: userFromDb  // здесь будет и createdAt
          });
        } catch (err) {
          console.error('❌ check() failed:', err);
          return res.status(500).json({ error: 'Server error' });
        }
      }

    async getAllUsers(req, res) {
      try {
        const users = await User.findAll({
          attributes: ['id', 'firstName', 'lastName', 'email', 'role']  
        });
        res.json(users);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка при получении пользователей' });
      }
    }

    async getOne(req, res) {
      try {
        const { id } = req.params;
        const item = await User.findByPk(id);
        if (!item) return res.status(404).json({ error: 'Not found' });
        return res.json(item);
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }

    async delete(req, res) {
      try {
        const { id } = req.params;
        const destroyed = await User.destroy({ where: { id } });
        if (!destroyed) return res.status(404).json({ error: 'Not found' });
        return res.json({ message: 'Deleted' });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }
}

module.exports = new UserController()