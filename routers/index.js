const Router = require('koa-router')
const router = new Router({ prefix: '/api' })
const jwt = require('jsonwebtoken')
const { jwtConfig } = require('../config')

router.use(async (ctx, next) => {
    // 过滤登录路由
    if (ctx.url.includes('login')) {
        await next()
        return
    }
    const token = ctx.headers['x-access-token']
    try {
        if (!token) throw ('token不存在')
        const decoded = await jwt.verify(token, jwtConfig.secret)
        if (!decoded) throw ('token非法')
        if (parseInt(Date.now() / 1000) > decoded.exp) throw ('token已过期')
        ctx.state.user = decoded
        await next()
    } catch (err) {
        ctx.body = { code: 101, msg: err.toString() }
    }
})

// router.use(require('./auth').routes())
// router.use(require('./sys_user').routes())
// router.use(require('./sys_role').routes())
// router.use(require('./sys_menu').routes())

module.exports = router