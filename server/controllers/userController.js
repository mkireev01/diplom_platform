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
       
          if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: "Не заполнены обязательные поля" });
          }
    

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
    
       
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);
    
   
          const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: role
          });
    

          const token = generateJwt(user.id, user.firstName, user.lastName, user.email, user.role)

          return res.status(201).json({ token });
        } catch (err) {
          console.error(err);
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
        const token = generateJwt(
            req.user.id,
            req.user.firstName,
            req.user.lastName,
            req.user.email,
            req.user.role
          );
        return res.json({token})
    }

    async getAllUsers(req, res) {
      try {
        const users = await User.findAll({
          attributes: ['id', 'firstName', 'lastName']  
        });
        res.json(users);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка при получении пользователей' });
      }
    }
}

module.exports = new UserController()