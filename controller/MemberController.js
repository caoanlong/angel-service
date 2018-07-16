const BaseController = require('./BaseController')
const Member = require('../model/Member')
const SmsCode = require('../model/SmsCode')
const validator = require('validator')
const { snowflake } = require('../utils')
const { jwtConfig } = require('../config')
const jwt = require('jsonwebtoken')

class MemberController extends BaseController {
	/**
	 * 根据条件分页查询列表
	 */
    findList() {
        return async ctx => {
            let { pageIndex = 1, pageSize = 10, keyword, startTime, endTime } = ctx.query
            pageIndex = Math.max(Number(pageIndex), 1)
            pageSize = Number(pageSize)
            const offset = (pageIndex - 1) * pageSize
            const where = {}
            if (keyword) {
                where['$or'] = {}
                where['$or']['name'] = { $like: '%' + keyword + '%' }
                where['$or']['mobile'] = { $like: '%' + keyword + '%' }
            }
            if (startTime || endTime) where['createTime'] = {}
            if (startTime) where['createTime']['$gte'] = new Date(Number(startTime))
            if (endTime) where['createTime']['$lte'] = new Date(Number(endTime))
            try {
                const members = await Member.findAndCountAll({
                    where, offset, limit: pageSize,
                    order: [['createTime', 'DESC']]
                })
                ctx.body = this.responseSussess({ pageIndex, pageSize, count: members.count, rows: members.rows })
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
            const { memberId } = ctx.query
            try {
                if (validator.isEmpty(memberId)) throw ('memberId不能为空！')
                const member = await Member.findById(memberId)
                ctx.body = this.responseSussess(member)
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
            const memberId = snowflake.nextId()
            const { name, mobile, avatar, sex, age, openId, remark } = ctx.request.body
            const data = {
                memberId,
                name,
                mobile,
                avatar,
                sex,
                age,
                openId,
                remark,
                createTime: new Date()
            }
            try {
                if (validator.isEmpty(name)) throw ('姓名不能为空！')
                if (validator.isEmpty(mobile)) throw ('手机号不能为空！')
                await Member.create(data)
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
            const { memberId, name, mobile, avatar, sex, age, remark } = ctx.request.body
            try {
                if (validator.isEmpty(memberId)) throw ('memberId不能为空！')
                const data = {
                    name,
                    mobile,
                    avatar,
                    sex,
                    age,
                    remark
                }
                await Member.update(data, { where: { memberId } })
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
                if (!ids || ids.length == 0) throw ('ids不能为空！')
                await Member.destroy({ where: { memberId: { $in: ids } } })
                ctx.body = this.responseSussess()
            } catch (err) {
                ctx.body = this.responseError(err)
            }
        }
    }
    /**
	 * 搜索建议
	 */
    suggest() {
        return async ctx => {
            const { keyword } = ctx.query
            const where = {}
            if (keyword) where['name'] = { $like: '%' + keyword + '%' }
            try {
                const members = await Member.findAll({ where })
                ctx.body = this.responseSussess(members)
            } catch (err) {
                ctx.body = this.responseError(err)
            }
        }
    }
    /**
	 * 禁用
	 */
    disable() {
        return async ctx => {
            const { memberId, isDisabled } = ctx.request.body
            try {
                if (validator.isEmpty(memberId)) throw ('memberId不能为空！')
                await Member.update({ isDisabled }, { where: { memberId } })
                ctx.body = this.responseSussess()
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
            const memberId = ctx.state.member.memberId
            try {
                const member = await Member.findById(memberId)
                ctx.body = this.responseSussess(member)
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
            const memberId = ctx.state.member.memberId
            const { name, avatar, sex, age, remark } = ctx.request.body
            try {
                const data = { name, avatar, sex, age, remark }
                await Member.update(data, { where: { memberId } })
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
            const { mobile, vcode } = ctx.request.body
            try {
                if (validator.isEmpty(mobile)) throw ('手机号不能为空！')
                if (validator.isEmpty(vcode)) throw ('验证码不能为空！')
                const smsCode = await SmsCode.find({ where: { mobile, vcode } })
                if (!smsCode) throw ('验证码错误！')
                const currentTime = new Date().getTime()
                const addTime = smsCode.updateTime
                const time = 120 * 1000
                if (currentTime - addTime > time) throw ('验证码已失效！')
                let member = await Member.find({ where: { mobile } })
                if (member) {
                    if (member.isDisabled) throw ('账号已被禁用！')
                } else {
                    const memberId = snowflake.nextId()
                    member = await Member.create({ memberId, mobile, createTime: new Date() })
                }
                const payLoad = {
                    memberId: member.memberId,
                    name: member.name,
                    mobile: member.mobile,
                    avatar: member.avatar,
                    sex: member.sex,
                    age: member.age,
                    remark: member.remark,
                    openId: member.openId,
                    isDisabled: member.isDisabled,
                    createTime: member.createTime,
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

module.exports = MemberController