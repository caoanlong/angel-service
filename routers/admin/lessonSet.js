const Router = require('koa-router')
const router = new Router({ prefix: '/lessonSet' })
const LessonSetController = require('../../controller/LessonSetController')

/* 获取列表 */
router.get('/list', new LessonSetController().findList())

/* 获取详情 */
router.get('/info', new LessonSetController().findById())

/* 添加 */
router.post('/add', new LessonSetController().create())

/* 修改 */
router.post('/update', new LessonSetController().update())

/* 删除 */
router.post('/delete', new LessonSetController().del())

module.exports = router