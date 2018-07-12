const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

const SysDict = require('./SysDict')

/* 平台产品 */
const PlatformProduct = sequelize.define('platformProduct', {
	// 平台产品ID
	platformProductId: {
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
	// 运费
	freight: {
		type: Sequelize.DOUBLE,
		defaultValue: 0
	},
	// 快递类型
	expressTypeId: {
		type: Sequelize.BIGINT(32),
		allowNull: false
	},
	// 价格
	price: {
		type: Sequelize.DOUBLE,
		allowNull: false
	},
	// 销量
	saleNum: {
		type: Sequelize.INTEGER,
		defaultValue: 0
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

PlatformProduct.belongsTo(SysDict, { as: 'expressType', foreignKey: 'expressTypeId' })

module.exports = PlatformProduct