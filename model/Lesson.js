const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

const Member = require('./Member')
const LessonSet = require('./LessonSet')

/* 会员课程 */
const Lesson = sequelize.define('lesson', {
    // 会员课程ID
    lessonId: {
        type: Sequelize.BIGINT(32),
        primaryKey: true,
        allowNull: false
    },
    // 会员ID
    memberId: {
        type: Sequelize.BIGINT(32),
        allowNull: false
    },
    // 课程ID
    lessonSetId: {
        type: Sequelize.BIGINT(32),
        allowNull: false
    },
    // 总课时   
    totalNum: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    // 已上课时 
    num: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    // 有效期至
    validityDate: {
        type: Sequelize.DATE,
        allowNull: false
    },
    // 创建时间
    createTime: {
        type: Sequelize.DATE
    }
})

Lesson.belongsTo(Member, { as: 'member', foreignKey: 'memberId' })
Lesson.belongsTo(LessonSet, { as: 'lessonSet', foreignKey: 'lessonSetId' })

module.exports = Lesson