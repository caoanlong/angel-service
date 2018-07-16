const BaseController = require('./BaseController')
const SmsCode = require('../model/SmsCode')
const validator = require('validator')
const { getVerCode } = require('../utils')

class CommonController extends BaseController {
    getSmsCode() {
        return async ctx => {
            const { mobile } = ctx.request.body
            try {
                if (validator.isEmpty(mobile)) throw ('手机号不能为空！')
                const smsCode = await SmsCode.find({ where: { mobile } })
                const code = getVerCode(6)
                console.log(code)
                const now = new Date().getTime()
                if (smsCode) {
                    await SmsCode.update({ code, updateTime: now }, { where: { mobile } })
                } else {
                    await SmsCode.create({ mobile, code, createTime: now, updateTime: now })
                }
                ctx.body = this.responseSussess(code)
            } catch (err) {
                ctx.body = this.responseError(err)
            }
        }
    }
}

module.exports = CommonController