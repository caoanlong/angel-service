const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

const SysUser = require('./SysUser')

/* 系统角色 */
const SysRole = sequelize.define('sysRole', {
	// 角色ID
	roleId: {
		type: Sequelize.BIGINT(32),
		primaryKey: true,
		allowNull: false
	},
	// 姓名
	name: {
		type: Sequelize.STRING(32),
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

// SysRole.belongsTo(SysUser, { as: 'createUser', foreignKey: 'createBy' })
// SysRole.belongsTo(SysUser, { as: 'updateUser', foreignKey: 'updateBy' })


module.exports = SysRole