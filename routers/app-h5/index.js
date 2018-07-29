const Router = require('koa-router')
const router = new Router({ prefix: '/appH5' })
const InterceptorController = require('../../controller/InterceptorController')

router.use(new InterceptorController().apiInterceptor())

router.use(require('./auth').routes())
router.use(require('./angelRemark').routes())
router.use(require('./healthRecord').routes())
router.use(require('./lessonPhoto').routes())
router.use(require('./teacherAdvice').routes())
router.use(require('./product').routes())
router.use(require('./order').routes())
router.use(require('./person').routes())
router.use(require('./lesson').routes())

module.exports = router