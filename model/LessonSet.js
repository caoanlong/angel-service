const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

const SysDict = require('./SysDict')

/* 课程套餐 */
const LessonSet = sequelize.define('lessonSet', {
	// 课程套餐ID
	lessonSetId: {
		type: Sequelize.BIGINT(32),
		primaryKey: true,
		allowNull: false
	},
	// 图片
	image: {
		type: Sequelize.STRING(1024)
	},
	// 名称
	name: {
		type: Sequelize.STRING(200),
		allowNull: false
	},
	// 类型
	typeId: {
		type: Sequelize.BIGINT(32),
		allowNull: false
	},
	// 课时数
	num: {
		type: Sequelize.INTEGER,
		allowNull: false
	},
	// 价格
	price: {
		type: Sequelize.DOUBLE,
		allowNull: false
	},
	// 有效期
	validityDate: {
		type: Sequelize.BIGINT(32),
		allowNull: false
	},
	// 简介
	remark: {
		type: Sequelize.TEXT
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

LessonSet.belongsTo(SysDict, { as: 'type', foreignKey: 'typeId' })
LessonSet.belongsTo(SysDict, { as: 'validDate', foreignKey: 'validityDate' })

module.exports = LessonSet