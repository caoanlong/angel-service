const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

const SysRole = require('./SysRole')
const SysRoleMenu = require('./SysRoleMenu')

/* 系统菜单 */
const SysMenu = sequelize.define('sysMenu', {
    // 菜单ID
	menuId: {
		type: Sequelize.BIGINT(32),
		primaryKey: true,
		allowNull: false
    },
    // 菜单父Id
	menuPid: {
        type: Sequelize.BIGINT(32),
        defaultValue: null
    },
    // 菜单名称
	name: {
		type: Sequelize.STRING(32),
		allowNull: false
    },
    // 菜单路由名
	routeName: {
		type: Sequelize.STRING(100),
		allowNull: false
    },
    // 菜单路径
	path: {
		type: Sequelize.STRING(100),
		allowNull: false
    },
    // 菜单图标
	icon: {
		type: Sequelize.STRING(100)
    },
    // 菜单排序
	sort: {
		type: Sequelize.BIGINT(10),
		defaultValue: 1
    },
    // 是否显示
	isShow: {
		type: Sequelize.BOOLEAN,
		defaultValue: true
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

// SysMenu.sync()
SysMenu.belongsToMany(SysRole, {through: SysRoleMenu, foreignKey: 'menuId'})
SysRole.belongsToMany(SysMenu, {through: SysRoleMenu, foreignKey: 'roleId'})

module.exports = SysMenu