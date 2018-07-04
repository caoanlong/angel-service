const Router = require('koa-router')
const router = new Router({ prefix: '/api' })
const InterceptorController = require('../../controller/InterceptorController')

router.use(InterceptorController.apiInterceptor())

router.use(require('../sysUser').routes())
router.use(require('../sysRole').routes())
router.use(require('../sysMenu').routes())
router.use(require('../sysDict').routes())

module.exports = router