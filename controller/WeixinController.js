const BaseController = require('./BaseController')
const axios = require('axios')

class WeixinController extends BaseController {
    getOpenId() {
        return async ctx => {
            const { code } = ctx.query
            const appid = 'wx089e5576879cd033'
            const secret = '1c095af73161ce8daf49d81a310042c7'
            const URL = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`
            try {
                if (!code) throw ('code不能为空！')
                const res = await axios.get(URL)
                ctx.body = this.responseSussess(res.data)
            } catch (err) {
                ctx.body = this.responseError(err)
            }
        }
    }
}

module.exports = WeixinController