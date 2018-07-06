const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

/* 权限角色与菜单关联 */
const SysRoleMenu = sequelize.define('sysRoleMenu', {
	id: {
		type: Sequelize.INTEGER,
		allowNull: false,
		autoIncrement: true,
		primaryKey: true
	},
	roleId: {
		type: Sequelize.BIGINT(32),
		allowNull: false
	},
	menuId: {
		type: Sequelize.BIGINT(32),
		allowNull: false
	}
})

module.exports = SysRoleMenu