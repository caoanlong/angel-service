const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

const SysStore = require('./SysStore')

/* 人员 */
const Person = sequelize.define('person', {
	// 人员ID
	personId: {
		type: Sequelize.BIGINT(32),
		primaryKey: true,
		autoIncrement: true,
		allowNull: false
	},
	// 类型
	type: {
		type: Sequelize.STRING(16),
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
		defaultValue: 'male'
	},
	// 年龄
	age: {
		type: Sequelize.INTEGER,
		defaultValue: 20
	},
	// 门店ID
	storeId: {
		type: Sequelize.BIGINT(32),
		allowNull: false
	},
	// 简介
	remark: {
		type: Sequelize.STRING(1024)
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

Person.belongsTo(SysStore, { as: 'store', foreignKey: 'storeId' })

module.exports = Person