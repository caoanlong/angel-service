const BaseController = require('./BaseController')
const SysMenu = require('../model/SysMenu')
const SysUser = require('../model/SysUser')
const SysRole = require('../model/SysRole')
const SysRoleMenu = require('../model/SysRoleMenu')
const validator = require('validator')
const { menusTree, snowflake } = require('../utils')

class SysMenuController extends BaseController {
    /**
     * 查询所有菜单
     */
    findAllList() {
        return async ctx => {
            try {
                const sysMenus = await SysMenu.findAll()
                const menus = await menusTree(sysMenus)
                ctx.body = this.responseSussess(menus)
            } catch (err) {
                ctx.body = this.responseError(err)
            }
        }
    }

    /**
     * 查询当前登录用户的权限菜单
     */
    findUserMenuList() {
        return async ctx => {
            const userId = ctx.state.user.userId
            try {
                const sysUser = await SysUser.findById(userId, {
                    include: [ { model: SysRole, include: [ { model: SysMenu } ] } ]
                })
                const sysMenus = sysUser.sysRole.sysMenus
                const menus = await menusTree(sysMenus)
                ctx.body = this.responseSussess(menus)
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
            const { menuId } = ctx.query
            try {
                if (!menuId) throw('menuId不能为空！')
                const sysMenu = await SysMenu.findById(menuId)
                ctx.body = this.responseSussess(sysMenu)
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
            const menuId = snowflake.nextId()
            const { menuPid, name, routeName, sort, path, icon, isShow, sysRoles = [] } = ctx.request.body
            const data = { 
                menuId, 
                menuPid, 
                name, 
                routeName, 
                sort, 
                path, 
                icon, 
                isShow,
                createBy: userId, 
                createTime: new Date(), 
                updateBy: userId, 
                updateTime: new Date() 
            }
            try {
                if (!name) throw('菜单名不能为空！')
                if (!routeName) throw('菜单路由名不能为空！')
                if (!path) throw('菜单路径不能为空！')
                const roleMenus = []
                for (let i = 0; i < sysRoles.length; i++) {
                	roleMenus.push({ menuId, roleId: sysRoles[i] })
                }
                await SysMenu.create(data)
                await SysRoleMenu.bulkCreate(roleMenus)
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
            const { menuId, menuPid, name, routeName, sort, path, icon, isShow, sysRoles = [] } = ctx.request.body
            const data = { 
                menuPid, 
                name, 
                routeName, 
                sort, 
                path, 
                icon, 
                isShow,
                updateBy: userId, 
                updateTime: new Date() 
            }
            try {
                if (!menuId) throw('menuId不能为空！')
                const roleMenus = []
                for (let i = 0; i < sysRoles.length; i++) {
                    roleMenus.push({ menuId, roleId: sysRoles[i] })
                }
                await SysMenu.update(data, { where: { menuId } })
                await SysRoleMenu.destroy({ where: { menuId } })
                await SysRoleMenu.bulkCreate(roleMenus)
                ctx.body = this.responseSussess()
            } catch (err) {
                ctx.body = this.responseError(err)
            }
        }
    }
    /**
     * 删除菜单
     */
    del() {
        return async ctx => {
            const { menuId } = ctx.request.body
            try {
                if (!menuId) throw('menuId不能为空！')
                await SysRoleMenu.destroy({ where: { menuId } })
                await SysMenu.destroy({ where: { menuPid: menuId } })
                await SysMenu.destroy({ where: { menuId } })
                ctx.body = this.responseSussess()
            } catch (err) {
                ctx.body = this.responseError(err)
            }
        }
    }
}

module.exports = SysMenuController