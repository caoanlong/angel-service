const BaseController = require('./BaseController')
const jwt = require('jsonwebtoken')
const { jwtConfig } = require('../config')

class InterceptorController extends BaseController {
    adminInterceptor() {
        return async (ctx, next) => {
            if (ctx.url.includes('login')) {
                await next()
                return
            }
            const token = ctx.headers['x-access-token']
            try {
                if (!token || token == 'undefined') throw ('token不存在')
                const decoded = await jwt.verify(token, jwtConfig.secret)
                if (!decoded) throw ('token非法')
                if (parseInt(Date.now() / 1000) > decoded.exp) throw ('token已过期')
                ctx.state.user = decoded
                await next()
            } catch (err) {
                ctx.body = this.responseError(err, 101)
            }
        }
    }
    apiInterceptor() {
        return async (ctx, next) => {
            if (ctx.url.includes('login') || ctx.url.includes('getSmsCode')) {
                await next()
                return
            }
            const token = ctx.headers['x-access-token']
            try {
                if (!token) throw ('token不存在')
                const decoded = await jwt.verify(token, jwtConfig.secret)
                if (!decoded) throw ('token非法')
                if (parseInt(Date.now() / 1000) > decoded.exp) throw ('token已过期')
                ctx.state.member = decoded
                await next()
            } catch (err) {
                ctx.body = this.responseError(err, 101)
            }
        }
    }
}

module.exports = InterceptorController