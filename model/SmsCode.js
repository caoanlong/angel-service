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
    },
    // 创建时间
    createTime: {
        type: Sequelize.DATE
    },
    // 更新时间
    updateTime: {
        type: Sequelize.DATE
    }
})


module.exports = SmsCode