const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

/* 人员老师 */
const Teacher = sequelize.define('teacher', {
    // 老师ID
    teacherId: {
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
    // 简介
    remark: {
        type: Sequelize.STRING(1024)
    },
    // 创建者
    createBy: {
        type: Sequelize.BIGINT(32)
    },
    // 创建时间
    createTime: {
        type: Sequelize.DATE
    },
    // 更新者
    updateBy: {
        type: Sequelize.BIGINT(32)
    },
    // 更新时间
    updateTime: {
        type: Sequelize.DATE
    }
})


module.exports = Teacher