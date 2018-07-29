const Router = require('koa-router')
const router = new Router({ prefix: '/lesson' })
const LessonController = require('../../controller/LessonController')

/* 获取列表 */
router.get('/list', new LessonController().findList())

/* 获取详情 */
router.get('/info', new LessonController().findById())

module.exports = router