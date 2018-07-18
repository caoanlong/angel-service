const Router = require('koa-router')
const router = new Router({ prefix: '/lessonPhoto' })
const LessonPhotoController = require('../../controller/LessonPhotoController')

/* 获取列表 */
router.get('/list', new LessonPhotoController().findList())

/* 获取详情 */
router.get('/info', new LessonPhotoController().findById())

/* 添加 */
router.post('/add', new LessonPhotoController().create())

/* 修改 */
router.post('/update', new LessonPhotoController().update())

/* 删除 */
router.post('/delete', new LessonPhotoController().del())

module.exports = router