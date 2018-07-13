const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

/* 短信验证码 */
const SmsCode = sequelize.define('smsCode', {
    codeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    code: {
        type: Sequelize.STRING(16),
        allowNull: false
    },
    mobile: {
        type: Sequelize.STRING(16),
        allowNull: false
    }
})


module.exports = SmsCode