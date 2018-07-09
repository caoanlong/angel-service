const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

/* 课程套餐 */
const LessonSet = sequelize.define('lessonSet', {
    // 课程套餐ID
    lessonSetId: {
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


module.exports = LessonSet