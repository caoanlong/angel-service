const BaseController = require('./BaseController')
const SysUser = require('../model/SysUser')
const SysRole = require('../model/SysRole')
const SysMenu = require('../model/SysMenu')
const validator = require('validator')
const { snowflake, generatePassword, menusTree } = require('../utils')
const { jwtConfig } = require('../config')
const jwt = require('jsonwebtoken')

class SysUserController extends BaseController {
	/**
	 * 根据条件分页查询列表
	 */
	findList() {
		return async ctx => {
			let { pageIndex = 1, pageSize = 10, keyword, roleId, isDisabled, startTime, endTime } = ctx.query
			pageIndex = Math.max( Number(pageIndex), 1 )
			pageSize = Number(pageSize)
			const offset = (pageIndex - 1) * pageSize
            const where = {}
			if (keyword) {
                where['$or'] = {}
                where['$or']['name'] = { $like: '%' + keyword + '%' }
                where['$or']['mobile'] = { $like: '%' + keyword + '%' }
			}
			if (roleId) where['roleId'] = roleId
            if (isDisabled == 'true') {
                where['isDisabled'] = true
            } else if (isDisabled == 'false') {
                where['isDisabled'] = false
            }
            if (startTime || endTime) where['createTime'] = {}
			if (startTime) where['createTime']['$gte'] = new Date(Number(startTime))
            if (endTime) where['createTime']['$lte'] = new Date(Number(endTime))
			try {
				const sysUsers = await SysUser.findAndCountAll({ 
					where, offset, limit: pageSize, 
					include: [ { model: SysRole, as: 'role' } ], 
					order: [ ['createTime', 'DESC'] ] 
				})
				ctx.body = this.responseSussess({ pageIndex, pageSize, count: sysUsers.count, rows: sysUsers.rows })
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
			const { userId } = ctx.query
			try {
				if (!userId) throw('userId不能为空！')
				const sysUser = await SysUser.findById(userId, {
                    include: { model: SysRole, as: 'role' }
                })
				sysUser.password = null
				ctx.body = this.responseSussess(sysUser)
			} catch (err) {
				ctx.body = this.responseError(err)
			}
		}
	}
	/**
	 * 根据token查询详情
	 */
	findByToken() {
		return async ctx => {
			const userId = ctx.state.user.userId
			try {
				const sysUser = await SysUser.findById(userId)
				sysUser.password = null
				ctx.body = this.responseSussess(sysUser)
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
			const ctxUserId = ctx.state.user.userId
			const userId = snowflake.nextId()
			const { name, mobile, avatar, password, roleId, isDisabled } = ctx.request.body
			const passwordHash = generatePassword(password)
			const data = { 
				userId, 
				name, 
				mobile, 
				avatar, 
				password: passwordHash, 
				roleId, 
				isDisabled, 
				createBy: ctxUserId, 
				createTime: new Date(), 
				updateBy: ctxUserId, 
				updateTime: new Date() 
			}
			try {
				if (!name) throw('姓名不能为空！')
				if (!password) throw('密码不能为空！')
				await SysUser.create(data)
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
			const ctxUserId = ctx.state.user.userId
			const { userId, name, mobile, avatar, password, roleId, isDisabled } = ctx.request.body
			try {
				if (!userId) throw('userId不能为空！')
				const data = {
					name, 
					mobile, 
					avatar, 
					roleId, 
					isDisabled, 
					updateBy: ctxUserId, 
					updateTime: new Date() 
				}
				if (password) data.password = generatePassword(password)
				await SysUser.update(data, { where: { userId } })
				ctx.body = this.responseSussess()
			} catch (err) {
				ctx.body = this.responseError(err)
			}
		}
	}
	/**
	 * 根据token修改资料
	 */
	updateByToken() {
		return async ctx => {
			const userId = ctx.state.user.userId
			const { mobile, avatar } = ctx.request.body
			try {
				const data = { mobile, avatar }
				await SysUser.update(data, { where: { userId } })
				ctx.body = this.responseSussess()
			} catch (err) {
				ctx.body = this.responseError(err)
			}
		}
	}
	/**
	 * 根据token修改密码
	 */
	updatePassword() {
		return async ctx => {
			const userId = ctx.state.user.userId
			const { oldPassword, newPassword } = ctx.request.body
			const oldPasswordHash = generatePassword(oldPassword)
			try {
				const sysUser = await SysUser.findById(userId)
				if (sysUser.password != oldPasswordHash) throw ('原密码不正确！')
				const password = generatePassword(newPassword)
				await SysUser.update({ password }, { where: { userId } })
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
				await SysUser.destroy({ where: { userId: { $in: ids } } })
				ctx.body = this.responseSussess()
			} catch (err) {
				ctx.body = this.responseError(err)
			}
		}
    }
    /**
	 * 获取用户权限菜单
	 */
    findMenuList() {
        return async ctx => {
            const roleId = ctx.state.user.roleId
            try {
                const sysRole = await SysRole.findById(roleId, {
                    include: [{ model: SysMenu }]
                })
                const menus = sysRole.sysMenus
                let menuIds = menus.map(item => item.menuId)
                menus.forEach(menu => {
                    if (menu.menuPid) menuIds.push(menu.menuPid)
                })
                menuIds = Array.from(new Set(menuIds))
                
                const sysMenus = await SysMenu.findAll({ where: { menuId: { $in: menuIds } } })
                const menuList = await menusTree(sysMenus)
                ctx.body = this.responseSussess({ menuList, menuIds })
            } catch (err) {
                ctx.body = this.responseError(err)
            }
        }
    }
	/**
	 * 登录
	 */
	login() {
		return async ctx => {
			const { name, password } = ctx.request.body
			const passwordHash = generatePassword(password)
			try {
				if (!name) throw('用户名不能为空！')
				if (!password) throw('密码不能为空！')
				const sysUser = await SysUser.find({ where: { name } })
				if (!sysUser) throw ('用户不存在！')
				if (sysUser.password != passwordHash) throw ('密码不正确！')
				const payLoad = {
					userId: sysUser.userId,
					roleId: sysUser.roleId,
					avatar: sysUser.avatar,
					name: sysUser.name,
					mobile: sysUser.mobile
				}
				const token = await jwt.sign(payLoad, jwtConfig.secret, jwtConfig.exp)
				ctx.set({ 'X-Access-Token': token })
				ctx.body = this.responseSussess()
			} catch (err) {
				ctx.body = this.responseError(err)
			}
		}
	}
}

module.exports = SysUserController