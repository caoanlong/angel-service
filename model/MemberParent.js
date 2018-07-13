const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

/* 会员家长关联表 */
const MemberParent = sequelize.define('memberParent', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    memberId: {
        type: Sequelize.BIGINT(32),
        allowNull: false
    },
    parentId: {
        type: Sequelize.BIGINT(32),
        allowNull: false
    }
})


module.exports = MemberParent