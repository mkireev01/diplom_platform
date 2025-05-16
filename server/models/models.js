const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define("User", {
  firstName:    { type: DataTypes.STRING, allowNull: false },
  lastName:     { type: DataTypes.STRING, allowNull: false },
  email:        { type: DataTypes.STRING, unique: true, allowNull: false },
  password:     { type: DataTypes.STRING, allowNull: false },
  role:         { type: DataTypes.ENUM('employer', 'seeker'), allowNull: false },
});

// Профиль компании
const Company = sequelize.define("Company", {
  name:        { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
});

// Резюме соискателя
const Resume = sequelize.define("Resume", {
  firstName:     { type: DataTypes.STRING, allowNull: false },
  lastName:      { type: DataTypes.STRING, allowNull: false },
  nationality:   { type: DataTypes.STRING },
  birthDate:     { type: DataTypes.DATEONLY },
  skills:        { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  experience:    { type: DataTypes.TEXT },      // краткое описание опыта
  fullText:      { type: DataTypes.TEXT },      // полное резюме
});

// Вакансии
const Vacancy = sequelize.define('Vacancy', {
  title:           { type: DataTypes.STRING, allowNull: false },
  description:     { type: DataTypes.TEXT },    // краткое описание
  fullDescription: { type: DataTypes.TEXT },    // полное описание для страницы вакансии
  salaryFrom:      { type: DataTypes.INTEGER },
  salaryTo:        { type: DataTypes.INTEGER },
});

// Отклики (Applications)
const Application = sequelize.define('Application', {
  status: {
    type: DataTypes.ENUM('new', 'viewed', 'accepted', 'rejected'),
    defaultValue: 'new'
  }
});

// Чаты и сообщения
const Chat = sequelize.define('Chat', {});

const Message = sequelize.define('Message', {
  content: { type: DataTypes.TEXT, allowNull: false },
});


// ─── СВЯЗИ ────────────────────────────────────────────────────────────────────

// Пользователь ↔ Компания
User.hasOne(Company, { foreignKey: 'userId' });
Company.belongsTo(User, { foreignKey: 'userId' });

// Пользователь ↔ Резюме
User.hasMany(Resume, { foreignKey: 'userId' });
Resume.belongsTo(User, { foreignKey: 'userId' });

// Компания ↔ Вакансии
Company.hasMany(Vacancy, { foreignKey: 'companyId' });
Vacancy.belongsTo(Company, { foreignKey: 'companyId' });

// Резюме ↔ Отклики
Resume.hasMany(Application, { foreignKey: 'resumeId' });
Application.belongsTo(Resume, { foreignKey: 'resumeId' });

// Вакансия ↔ Отклики
Vacancy.hasMany(Application, { foreignKey: 'vacancyId' });
Application.belongsTo(Vacancy, { foreignKey: 'vacancyId' });

// Чат между соискателем и работодателем
Chat.belongsTo(User, { as: 'seeker',   foreignKey: 'seekerId' });
Chat.belongsTo(User, { as: 'employer', foreignKey: 'employerId' });
User.hasMany(Chat, { foreignKey: 'seekerId' });
User.hasMany(Chat, { foreignKey: 'employerId' });

// Чат ↔ Сообщения
Chat.hasMany(Message, { foreignKey: 'chatId' });
Message.belongsTo(Chat, { foreignKey: 'chatId' });

// Пользователь ↔ Сообщения
User.hasMany(Message, { foreignKey: 'senderId' });
Message.belongsTo(User, { foreignKey: 'senderId' });


module.exports = {
  User,
  Company,
  Resume,
  Vacancy,
  Application,
  Chat,
  Message
};
