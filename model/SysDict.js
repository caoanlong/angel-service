const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

/* 系统字典 */
const SysDict = sequelize.define('sysDict', {
	// 字典ID
	dictId: {
		type: Sequelize.BIGINT(32),
		primaryKey: true,
		autoIncrement: true,
		allowNull: false
    },
    // 键
	key: {
		type: Sequelize.STRING(100),
		allowNull: false
    },
    // 值
	value: {
		type: Sequelize.STRING(100),
		allowNull: false
    },
    // 类型
	type: {
		type: Sequelize.STRING(100),
		allowNull: false
    },
    // 排序
	sort: {
		type: Sequelize.BIGINT(10),
		defaultValue: 1
    },
    // 描述
	description: {
		type: Sequelize.STRING(500)
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

module.exports = SysDict