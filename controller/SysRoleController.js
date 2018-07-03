const BaseController = require('./BaseController')
const SysRole = require('../model/SysRole')
const SysRoleMenu = require('../model/SysRoleMenu')
const validator = require('validator')
const { snowflake } = require('../utils')

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
            if (startTime) where['createTime']['$gte'] = startTime
            if (endTime) where['createTime']['$lte'] = endTime
            try {
                const sysRoles = await SysRole.findAndCountAll({ where, offset, limit: pageSize, order: [ ['createTime', 'DESC'] ] })
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
                if (validator.isEmpty(roleId)) throw('roleId不能为空！')
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
            const roleId = snowflake.nextId()
            const { name } = ctx.request.body
            const data = { 
                roleId, 
                name, 
                createBy: userId, 
                createTime: new Date(), 
                updateBy: userId, 
                updateTime: new Date() 
            }
            try {
                if (validator.isEmpty(name)) throw('角色名不能为空！')
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
                if (validator.isEmpty(roleId)) throw('roleId不能为空！')
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
                await SysRole.destroy({ where: { roleId: { $in: ids }}})
                ctx.body = this.responseSussess()
            } catch (err) {
                ctx.body = this.responseError(err)
            }
        }
    }
    /**
     * 根据当前角色设置菜单权限
     */
    updateMenu() {
        return async ctx => {
            const { roleId, sysMenus = [] } = ctx.request.body
            const roleMenus = []
            try {
                if (validator.isEmpty(roleId)) throw('roleId不能为空！')
                for (let i = 0; i < sysMenus.length; i++) {
                    roleMenus.push({ menuId: sysMenus[i], roleId })
                }
                await SysRoleMenu.destroy({ where: { roleId } })
                await SysRoleMenu.bulkCreate(roleMenus)
                ctx.body = this.responseSussess()
            } catch (err) {
                ctx.body = this.responseError(err)
            }
        }
    }
}

module.exports = new SysRoleController()