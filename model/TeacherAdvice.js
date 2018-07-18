const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

const Member = require('./Member')
const Person = require('./Person')

/* 老师建议 */
const TeacherAdvice = sequelize.define('teacherAdvice', {
    // 老师建议ID
    teacherAdviceId: {
        type: Sequelize.BIGINT(32),
        primaryKey: true,
        allowNull: false
    },
    // 会员ID
    memberId: {
        type: Sequelize.BIGINT(32),
        allowNull: false
    },
    // 老师ID
    personId: {
        type: Sequelize.BIGINT(32),
        allowNull: false
    },
    // 详情
    remark: {
        type: Sequelize.STRING(1024),
        allowNull: false
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

TeacherAdvice.belongsTo(Member, { as: 'member', foreignKey: 'memberId' })
TeacherAdvice.belongsTo(Person, { as: 'person', foreignKey: 'personId' })

module.exports = TeacherAdvice