const Router = require('koa-router')
const router = new Router({ prefix: '/appH5' })
const InterceptorController = require('../../controller/InterceptorController')

// router.use(new InterceptorController().apiInterceptor())

module.exports = router