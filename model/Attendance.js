const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

const Member = require('./Member')

/* 考勤 */
const Attendance = sequelize.define('attendance', {
    // 考勤ID
    attendanceId: {
        type: Sequelize.BIGINT(32),
        primaryKey: true,
        allowNull: false
    },
    // 会员ID
    memberId: {
        type: Sequelize.BIGINT(32),
        allowNull: false
    },
    // 状态
    status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    // 创建时间
    createTime: {
        type: Sequelize.DATE
    }
})

Attendance.belongsTo(Member, { as: 'member', foreignKey: 'memberId' })

module.exports = Attendance