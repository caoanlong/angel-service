const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

const SysRole = require('./SysRole')

/* 系统用户 */
const SysUser = sequelize.define('sysUser', {
	// 用户ID
	userId: {
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
	// 密码
	password: {
		type: Sequelize.STRING(255),
		allowNull: false
	},
	// 角色ID
	roleId: {
		type: Sequelize.BIGINT(32)
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

SysUser.belongsTo(SysRole, { as: 'role', foreignKey: 'roleId' })

module.exports = SysUser