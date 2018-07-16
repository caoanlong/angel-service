const Router = require('koa-router')
const router = new Router({prefix: '/admin'})
const InterceptorController = require('../../controller/InterceptorController')

router.use(new InterceptorController().adminInterceptor())

router.use(require('./auth').routes())
router.use(require('./sysUser').routes())
router.use(require('./sysRole').routes())
router.use(require('./sysMenu').routes())
router.use(require('./sysDict').routes())
router.use(require('./doctor').routes())
router.use(require('./teacher').routes())
router.use(require('./lessonSet').routes())
router.use(require('./platformProduct').routes())
router.use(require('./member').routes())
router.use(require('./lesson').routes())
router.use(require('./order').routes())
router.use(require('./attendance').routes())

module.exports = router