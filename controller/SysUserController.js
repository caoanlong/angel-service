const BaseController = require('./BaseController')
const SysUser = require('../model/SysUser')
const SysRole = require('../model/SysRole')
const validator = require('validator')
const { snowflake, generatePassword } = require('../utils')

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
                where['name'] = { $like: '%' + keyword + '%' }
                where['mobile'] = { $like: '%' + keyword + '%' }
            }
            if (roleId) where['roleId'] = roleId
            if (isDisabled) where['isDisabled'] = isDisabled
            if (startTime) where['createTime']['$gte'] = startTime
            if (endTime) where['createTime']['$lte'] = endTime
            try {
                const sysUsers = await SysUser.findAndCountAll({ where, offset, limit: pageSize, order: [ ['createTime', 'DESC'] ] })
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
                if (validator.isEmpty(userId)) throw('userId不能为空！')
                const sysUser = await SysUser.findById(userId, {
                    include: [ { model: SysRole } ]
                })
                delete sysUser.password
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
        const userId = ctx.state.user.userId
        try {
            const sysUser = await SysUser.findById(userId)
            delete sysUser.password
            ctx.body = this.responseSussess(sysUser)
        } catch (err) {
            ctx.body = this.responseError(err)
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
            const data = { 
                userId, 
                name, 
                mobile, 
                avatar, 
                password, 
                roleId, 
                isDisabled, 
                createBy: ctxUserId, 
                createTime: new Date(), 
                updateBy: ctxUserId, 
                updateTime: new Date() 
            }
            try {
                if (validator.isEmpty(name)) throw('姓名不能为空！')
                if (validator.isEmpty(password)) throw('密码不能为空！')
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
                if (validator.isEmpty(userId)) throw('userId不能为空！')
                const data = {
                    name, 
                    mobile, 
                    avatar, 
                    password, 
                    roleId, 
                    isDisabled, 
                    updateBy: ctxUserId, 
                    updateTime: new Date() 
                }
                await SysUser.update(data, { where: { userId } })
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
                await SysUser.destroy({ where: { userId: { $in: ids }}})
                ctx.body = this.responseSussess()
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
            try {
                if (validator.isEmpty(name)) throw('用户名不能为空！')
                if (validator.isEmpty(password)) throw('密码不能为空！')
                SysUser.findOne({})
                ctx.body = this.responseSussess()
            } catch (err) {
                ctx.body = this.responseError(err)
            }
        }
    }
}

module.exports = new SysUserController()