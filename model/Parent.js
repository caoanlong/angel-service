const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

/* 家长 */
const Parent = sequelize.define('parent', {
    // 家长ID
    parentId: {
        type: Sequelize.BIGINT(32),
        primaryKey: true,
        allowNull: false
    },
    // 姓名
    name: {
        type: Sequelize.STRING(32),
        allowNull: false
    },
    // 电话
    mobile: {
        type: Sequelize.STRING(16)
    },
    // 头像
    avatar: {
        type: Sequelize.STRING(1024)
    },
    // 性别
    sex: {
        type: Sequelize.STRING(10),
        defaultValue: 'male'
    },
    // 年龄
    age: {
        type: Sequelize.INTEGER,
        defaultValue: 20
    },
    // 简介
    remark: {
        type: Sequelize.STRING(1024)
    }
})


module.exports = Parent