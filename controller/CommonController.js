const BaseController = require('./BaseController')
const SmsCode = require('../model/SmsCode')
const Member = require('../model/Member')
const validator = require('validator')
const axios = require('axios')
const qs = require('qs')
const { getVerCode } = require('../utils')

class CommonController extends BaseController {
	getSmsCode() {
		const apikey = 'b052d3d285acb489dcfa0b20f9d833bc'
		const url = 'https://sms.yunpian.com/v2/sms/tpl_single_send.json'
		const tpl_id = 2431734
		return async ctx => {
			const { mobile } = ctx.request.body
			try {
				if (!mobile) throw ('手机号不能为空！')
				if (!/^[1][3578][0-9]{9}$/.test(mobile)) throw ('请输入正确的手机号！')
				const member = await Member.find({ where: { mobile } })
				if (!member) throw ('账号不存在，请联系工作人员！')
				if (member.isDisabled) throw ('账号已被禁用，请联系工作人员！')
				const smsCode = await SmsCode.find({ where: { mobile } })
				const now = new Date()
				const code = getVerCode(6)
				const tpl_value = `#code#=${code}&#app#=天使无忧`
				const data = { apikey, mobile, tpl_id, tpl_value }
				if (smsCode) {
					const time = 5 * 1000
					if (now.getTime() - smsCode.updateTime < time) throw ('发送太频繁！')
					const res = await axios({
						url,
						data,
						method: 'post',
						transformRequest: [function (params) {
							return qs.stringify(params)
						}],
						headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
					})
					if (res.data.code != 0) throw ('发送短信失败！')
					await SmsCode.update({ code, updateTime: now }, { where: { mobile } })
				} else {
					const res = await axios({
						url,
						data,
						method: 'post',
						transformRequest: [function (params) {
							return qs.stringify(params)
						}],
						headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
					})
					if (res.data.code != 0) throw ('发送短信失败！')
					await SmsCode.create({ mobile, code, createTime: now, updateTime: now })
				}
				ctx.body = this.responseSussess()
			} catch (err) {
				ctx.body = this.responseError(err)
			}
		}
	}
}

module.exports = CommonController