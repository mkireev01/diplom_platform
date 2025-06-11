const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define("User", {
  firstName:    { type: DataTypes.STRING, allowNull: false },
  lastName:     { type: DataTypes.STRING, allowNull: false },
  email:        { type: DataTypes.STRING, unique: true, allowNull: false },
  password:     { type: DataTypes.STRING, allowNull: false },
  role:         { type: DataTypes.ENUM('employer', 'seeker', 'ADMIN'), allowNull: false },
});


const Company = sequelize.define("Company", {
  name:             { type: DataTypes.STRING, allowNull: false },
  description:      { type: DataTypes.TEXT },
  telephoneNumber:  {
    type: DataTypes.STRING(16),
    allowNull: true,
    unique: true,
    validate: {
      is: /^\+[1-9]\d{1,14}$/
    }
  }
});



const Resume = sequelize.define("Resume", {
  firstName:     { type: DataTypes.STRING, allowNull: false },
  lastName:      { type: DataTypes.STRING, allowNull: false },
  nationality:   { type: DataTypes.STRING },
  birthDate:     { type: DataTypes.DATEONLY },
  skills:        { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  experience:    { type: DataTypes.TEXT },      
  fullText:      { type: DataTypes.TEXT },      
});


const Vacancy = sequelize.define('Vacancy', {
  title:           { type: DataTypes.STRING, allowNull: false },
  description:     { type: DataTypes.TEXT },    
  fullDescription: { type: DataTypes.TEXT },
  location: {type: DataTypes.STRING},
  employment: {type: DataTypes.ENUM("fullemployment", "underemployment", "remotely"), allowNull: false},    
  salaryFrom:      { type: DataTypes.INTEGER },
  salaryTo:        { type: DataTypes.INTEGER },
});


const Application = sequelize.define('Application', {
  status: {
    type: DataTypes.ENUM('new', 'viewed', 'accepted', 'rejected'),
    defaultValue: 'new'
  },
  coverLetter: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});


const Chat = sequelize.define('Chat', {});

const Message = sequelize.define('Message', {
  content: { type: DataTypes.TEXT, allowNull: false },
});




User.hasOne(Company, { foreignKey: 'userId' });
Company.belongsTo(User, { foreignKey: 'userId' });


User.hasMany(Resume, { foreignKey: 'userId' });
Resume.belongsTo(User, { foreignKey: 'userId' });


Company.hasMany(Vacancy, { foreignKey: 'companyId' });
Vacancy.belongsTo(Company, { foreignKey: 'companyId' });


Resume.hasMany(Application, { foreignKey: 'resumeId' });
Application.belongsTo(Resume, { foreignKey: 'resumeId' });


Vacancy.hasMany(Application, { foreignKey: 'vacancyId' });
Application.belongsTo(Vacancy, { foreignKey: 'vacancyId' });


Chat.belongsTo(User, { as: 'seeker',   foreignKey: 'seekerId' });
Chat.belongsTo(User, { as: 'employer', foreignKey: 'employerId' });
User.hasMany(Chat, { foreignKey: 'seekerId' });
User.hasMany(Chat, { foreignKey: 'employerId' });


Chat.hasMany(Message, { foreignKey: 'chatId' });
Message.belongsTo(Chat, { foreignKey: 'chatId' });


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
