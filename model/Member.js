const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

const Parent = require('./Parent')
const MemberParent = require('./MemberParent')

/* 会员 */
const Member = sequelize.define('member', {
    // 会员ID
    memberId: {
        type: Sequelize.BIGINT(32),
        primaryKey: true,
        allowNull: false
    },
    // 姓名
    name: {
        type: Sequelize.STRING(32),
        allowNull: false,
        defaultValue: ''
    },
    // 电话
    mobile: {
        type: Sequelize.STRING(16)
    },
    // 头像
    avatar: {
        type: Sequelize.STRING(1024)
    },
    // 性别
    sex: {
        type: Sequelize.STRING(10),
        defaultValue: 'male'
    },
    // 年龄
    age: {
        type: Sequelize.INTEGER,
        defaultValue: 2
    },
    // 简介
    remark: {
        type: Sequelize.STRING(1024)
    },
    // openId
    openId: {
        type: Sequelize.STRING(256)
    },
    // 是否禁用
    isDisabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    // 创建时间
    createTime: {
        type: Sequelize.DATE
    }
})

Member.belongsToMany(Parent, { through: MemberParent, foreignKey: 'memberId' })
Parent.belongsToMany(Member, { through: MemberParent, foreignKey: 'parentId' })

module.exports = Member