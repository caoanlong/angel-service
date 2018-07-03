const Router = require('koa-router')
const router = new Router({ prefix: '/admin' })
const InterceptorController = require('../controller/InterceptorController')

router.use(InterceptorController.adminInterceptor())

router.use(require('../sysUser').routes())
router.use(require('../sysRole').routes())
router.use(require('../sysMenu').routes())
router.use(require('../sysDict').routes())

module.exports = router