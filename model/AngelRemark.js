const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

const Member = require('./Member')
const Person = require('./Person')

/* 老师建议 */
const AngelRemark = sequelize.define('angelRemark', {
    // 老师建议ID
    angelRemarkId: {
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
    teacherId: {
        type: Sequelize.BIGINT(32),
        allowNull: false
    },
    // 详情
    remark: {
        type: Sequelize.STRING(1024),
        allowNull: false
    },
    // 创建时间
    createTime: {
        type: Sequelize.DATE
    }
})

AngelRemark.belongsTo(Member, { as: 'member', foreignKey: 'memberId' })
AngelRemark.belongsTo(Person, { as: 'teacher', foreignKey: 'teacherId' })

module.exports = AngelRemark