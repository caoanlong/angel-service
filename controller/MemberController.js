const BaseController = require('./BaseController')
const Member = require('../model/Member')
const SmsCode = require('../model/SmsCode')
const SysStore = require('../model/SysStore')
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
			let { pageIndex = 1, pageSize = 10, keyword, storeId, startTime, endTime } = ctx.query
			pageIndex = Math.max(Number(pageIndex), 1)
			pageSize = Number(pageSize)
			const offset = (pageIndex - 1) * pageSize
			const where = {}
			if (storeId) where['storeId'] = storeId
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
					include: [{ model: SysStore, as: 'store' }],
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
				if (!memberId) throw ('memberId不能为空！')
				const member = await Member.findById(memberId, {
					include: [{ model: SysStore, as: 'store' }]
				})
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
			const userId = ctx.state.user.userId
			const memberId = snowflake.nextId()
			const { name, mobile, avatar, sex, age, code, storeId, parentName, parentMobile, from, remark } = ctx.request.body
			const data = {
				memberId,
				name,
				mobile,
				avatar,
				sex,
				age,
				code,
				storeId,
				parentName,
				parentMobile,
				from,
				remark,
				createBy: userId,
				createTime: new Date(), 
				updateBy: userId, 
				updateTime: new Date() 
			}
			try {
				if (!name) throw ('姓名不能为空！')
				if (!mobile) throw ('手机号不能为空！')
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
			const userId = ctx.state.user.userId
			const { memberId, name, mobile, avatar, sex, age, code, storeId, parentName, parentMobile, openId, from, remark } = ctx.request.body
			try {
				if (!memberId) throw ('memberId不能为空！')
				const data = {
					name,
					mobile,
					avatar,
					sex,
					age,
					code,
					storeId,
					parentName,
					parentMobile,
					openId,
					from,
					remark,
					updateBy: userId, 
					updateTime: new Date() 
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
				if (!memberId) throw ('memberId不能为空！')
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
			const { avatar, sex, age, remark } = ctx.request.body
			try {
				const data = { avatar, sex, age, remark }
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
				if (!mobile) throw ('手机号不能为空！')
				if (!vcode) throw ('验证码不能为空！')
				const smsCode = await SmsCode.find({ where: { mobile, code: vcode } })
				if (!smsCode) throw ('验证码错误！')
				const currentTime = new Date().getTime()
				const addTime = smsCode.updateTime
				const time = 120 * 1000
				if (currentTime - addTime > time) throw ('验证码已失效！')
				const member = await Member.find({ where: { mobile } })
				if (!member) throw ('账号不存在，请联系工作人员！')
				if (member.isDisabled) throw ('账号已被禁用，请联系工作人员！')
				const payLoad = {
					memberId: member.memberId,
					name: member.name,
					mobile: member.mobile,
					avatar: member.avatar,
					sex: member.sex,
					age: member.age,
					code: member.code,
					storeId: member.storeId,
					parentName: member.parentName,
					parentMobile: member.parentMobile,
					remark: member.remark,
					from: member.from,
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