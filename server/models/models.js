const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define("User", {
    fullName: DataTypes.STRING,
    email: {type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    role: DataTypes.ENUM('employer', 'seeker'),
})

const Company = sequelize.define("Company", {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
})

const Resume = sequelize.define("Resume", {
    title: DataTypes.STRING,
    experience: DataTypes.TEXT,
    skills: DataTypes.ARRAY(DataTypes.STRING),
})

const Vacancy = sequelize.define('Vacancy', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    salaryFrom: DataTypes.INTEGER,
    salaryTo: DataTypes.INTEGER,
})

const Application = sequelize.define('Application', {
    status: {
      type: DataTypes.ENUM('new', 'viewed', 'accepted', 'rejected'),
      defaultValue: 'new'
    }
});

const Chat = sequelize.define('Chat', {});

const Message = sequelize.define('Message', {
    content: DataTypes.TEXT,
});

User.hasOne(Company, { foreignKey: 'userId' });
User.hasMany(Resume, { foreignKey: 'userId' });
User.hasMany(Chat, { foreignKey: 'userId' });
User.hasMany(Message, { foreignKey: 'senderId' });

Company.belongsTo(User, { foreignKey: 'userId' });
Company.hasMany(Vacancy, { foreignKey: 'companyId' });

Resume.belongsTo(User, { foreignKey: 'userId' });
Resume.hasMany(Application, { foreignKey: 'resumeId' });

Vacancy.belongsTo(Company, { foreignKey: 'companyId' });
Vacancy.hasMany(Application, { foreignKey: 'vacancyId' });

Application.belongsTo(Resume, { foreignKey: 'resumeId' });
Application.belongsTo(Vacancy, { foreignKey: 'vacancyId' });

Chat.belongsTo(User, { as: 'seeker', foreignKey: 'seekerId' });
Chat.belongsTo(User, { as: 'employer', foreignKey: 'employerId' });
Chat.hasMany(Message, { foreignKey: 'chatId' });

Message.belongsTo(Chat, { foreignKey: 'chatId' });
Message.belongsTo(User, { foreignKey: 'senderId' });

module.exports = {
    User,
    Company,
    Resume,
    Vacancy,
    Application,
    Chat,
    Message
}