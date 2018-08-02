const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

const SysStore = require('./SysStore')

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
	// 性别
	sex: {
		type: Sequelize.STRING(10),
		defaultValue: '男'
	},
	// 年龄
	age: {
		type: Sequelize.INTEGER,
		defaultValue: 2
	},
	// 编码
	code: {
		type: Sequelize.STRING(16)
	},
	// 家长姓名
	parentName: {
		type: Sequelize.STRING(32)
	},
	// 家长电话
	parentMobile: {
		type: Sequelize.STRING(16)
	},
	// 门店ID
	storeId: {
		type: Sequelize.BIGINT(32),
		allowNull: false
	},
	// 来源
	from: {
		type: Sequelize.STRING(16)
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

Member.belongsTo(SysStore, { as: 'store', foreignKey: 'storeId' })

module.exports = Member