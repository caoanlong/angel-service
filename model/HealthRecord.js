const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

const Member = require('./Member')
const Doctor = require('./Doctor')
const SysDict = require('./SysDict')

/* 健康报告 */
const HealthRecord = sequelize.define('healthRecord', {
    // 健康报告ID
    HealthRecordId: {
        type: Sequelize.BIGINT(32),
        primaryKey: true,
        allowNull: false
    },
    // 名称
    name: {
        type: Sequelize.STRING(200),
        allowNull: false
    },
    // 会员ID
    memberId: {
        type: Sequelize.BIGINT(32),
        allowNull: false
    },
    // 医生ID
    doctorId: {
        type: Sequelize.BIGINT(32),
        allowNull: false
    },
    // 类型 
    typeId: {
        type: Sequelize.BIGINT(32),
        allowNull: false
    },
    // 报告日期
    recordDate: {
        type: Sequelize.DATE
    },
    // 报告文件PDF
    file: {
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

HealthRecord.belongsTo(Member, { as: 'member', foreignKey: 'memberId' })
HealthRecord.belongsTo(Doctor, { as: 'doctor', foreignKey: 'doctorId' })
HealthRecord.belongsTo(SysDict, { as: 'type', foreignKey: 'typeId' })

module.exports = HealthRecord