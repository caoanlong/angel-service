const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

const Member = require('./Member')
const Person = require('./Person')
const SysStore = require('./SysStore')

/* 天使留言 */
const AngelRemark = sequelize.define('angelRemark', {
    // 天使留言ID
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
    // 人员ID
    personId: {
        type: Sequelize.BIGINT(32),
        allowNull: false
    },
    // 门店ID
    storeId: {
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
    },
    // 修改时间
    updateTime: {
        type: Sequelize.DATE
    }
})

AngelRemark.belongsTo(Member, { as: 'member', foreignKey: 'memberId' })
AngelRemark.belongsTo(Person, { as: 'person', foreignKey: 'personId' })
AngelRemark.belongsTo(SysStore, { as: 'store', foreignKey: 'storeId' })

module.exports = AngelRemark