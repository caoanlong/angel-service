const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

const Member = require('./Member')
const SysStore = require('./SysStore')

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
    // 门店ID
    storeId: {
        type: Sequelize.BIGINT(32),
        allowNull: false
    },
    // 状态
    status: {
        type: Sequelize.STRING(16),
        defaultValue: 'confirm'
    },
    // 打卡时间
    createTime: {
        type: Sequelize.DATE
    },
    // 确认时间
    confirmTime: {
        type: Sequelize.DATE
    }
})

Attendance.belongsTo(Member, { as: 'member', foreignKey: 'memberId' })
Attendance.belongsTo(SysStore, { as: 'store', foreignKey: 'storeId' })

module.exports = Attendance