const BaseController = require('./BaseController')
const axios = require('axios')

class WeixinController extends BaseController {
    getOpenId() {
        return async ctx => {
            const { code } = ctx.query
            console.log(`code=${code}`)
            const URL = `https://api.weixin.qq.com/sns/jscode2session?appid=wx6d8a92e6b3c016e4&secret=tianshiwuyou&js_code=${code}&grant_type=authorization_code`
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