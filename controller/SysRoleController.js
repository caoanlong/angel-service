const BaseController = require('./BaseController')
const SysRole = require('../model/SysRole')
const SysUser = require('../model/SysUser')
const SysMenu = require('../model/SysMenu')
const SysRoleMenu = require('../model/SysRoleMenu')
const validator = require('validator')
const { snowflake, menusTree } = require('../utils')

class SysRoleController extends BaseController {
	/**
	 * 根据条件分页查询列表
	 */
	findList() {
		return async ctx => {
			let { pageIndex = 1, pageSize = 10, name, startTime, endTime } = ctx.query
			pageIndex = Math.max( Number(pageIndex), 1 )
			pageSize = Number(pageSize)
			const offset = (pageIndex - 1) * pageSize
			const where = {}
			if (name) where['name'] = { $like: '%' + name + '%' }
            if (startTime || endTime) where['createTime'] = {}
            if (startTime) where['createTime']['$gte'] = new Date(Number(startTime))
            if (endTime) where['createTime']['$lte'] = new Date(Number(endTime))
			try {
				const sysRoles = await SysRole.findAndCountAll({ 
					where, offset, limit: pageSize, 
					order: [ ['createTime', 'DESC'] ] 
				})
				ctx.body = this.responseSussess({ pageIndex, pageSize, count: sysRoles.count, rows: sysRoles.rows })
			} catch (err) {
				ctx.body = this.responseError(err)
			}
		}
	}
	/**
	 * 根据Id查询详情
	 */
	findById() {
		return async ctx => {
			const { roleId } = ctx.query
			try {
				if (!roleId) throw('roleId不能为空！')
				const sysRole = await SysRole.findById(roleId)
				ctx.body = this.responseSussess(sysRole)
			} catch (err) {
				ctx.body = this.responseError(err)
			}
		}
	}
	/**
	 * 添加
	 */
	create() {
		return async ctx => {
			const userId = ctx.state.user.userId
			const { name } = ctx.request.body
			const data = {
				name, 
				createBy: userId, 
				createTime: new Date(), 
				updateBy: userId, 
				updateTime: new Date() 
			}
			try {
				if (!name) throw('角色名不能为空！')
				await SysRole.create(data)
				ctx.body = this.responseSussess()
			} catch (err) {
				ctx.body = this.responseError(err)
			}
		}
	}
	/**
	 * 修改
	 */
	update() {
		return async ctx => {
			const userId = ctx.state.user.userId
			const { roleId, name } = ctx.request.body
			try {
				if (!roleId) throw('roleId不能为空！')
				const data = {
					name, 
					updateBy: userId, 
					updateTime: new Date() 
				}
				await SysRole.update(data, { where: { roleId } })
				ctx.body = this.responseSussess()
			} catch (err) {
				ctx.body = this.responseError(err)
			}
		}
	}
	/**
	 * 删除
	 */
	del() {
		return async ctx => {
			const { ids } = ctx.request.body
			try {
                if (!ids || ids.length == 0) throw('ids不能为空！')
                const sysUsers = await SysUser.findAll({ where: { roleId: { $in: ids } } })
                if (sysUsers.length > 0) throw (`角色已关联了${sysUsers.length}个用户！`)
				await SysRole.destroy({ where: { roleId: { $in: ids } } })
				ctx.body = this.responseSussess()
			} catch (err) {
				ctx.body = this.responseError(err)
			}
		}
	}
	/**
	 * 获取角色权限菜单
	 */
	findMenuList() {
		return async ctx => {
			const { roleId } = ctx.query
			try {
				if (!roleId) throw('roleId不能为空！')
				const menus = await SysMenu.findAll()
				const menuList = await menusTree(menus)
				const sysRole = await SysRole.findById(roleId, {
					include: [ { model: SysMenu } ]
				})
				const menuIds = sysRole.sysMenus.map(item => item.menuId)
				ctx.body = this.responseSussess({ menuList, menuIds})
			} catch (err) {
				ctx.body = this.responseError(err)
			}
		}
	}

	/**
	 * 根据当前角色设置菜单权限
	 */
	addAuthority() {
		return async ctx => {
			const { roleId, menuIds = [] } = ctx.request.body
			const roleMenus = []
			try {
                if (!roleId) throw('roleId不能为空！')
                await SysRoleMenu.destroy({ where: { roleId } })
				const sysMenus = await SysMenu.findAll({
					where: { menuId: { $in: menuIds}}
				})
				for (let i = 0; i < sysMenus.length; i++) {
					let index = menuIds.indexOf(sysMenus[i].menuPid)
					if (index > -1) {
						menuIds.splice(index, 1)
					}
				}
				for (let i = 0; i < menuIds.length; i++) {
                    roleMenus.push({ menuId: menuIds[i], roleId })
                }
				await SysRoleMenu.bulkCreate(roleMenus)
				ctx.body = this.responseSussess()
			} catch (err) {
				ctx.body = this.responseError(err)
			}
		}
	}
}

module.exports = SysRoleController