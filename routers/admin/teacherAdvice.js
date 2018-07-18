const Router = require('koa-router')
const router = new Router({ prefix: '/teacherAdvice' })
const TeacherAdviceController = require('../../controller/TeacherAdviceController')

/* 获取列表 */
router.get('/list', new TeacherAdviceController().findList())

/* 获取详情 */
router.get('/info', new TeacherAdviceController().findById())

/* 添加 */
router.post('/add', new TeacherAdviceController().create())

/* 修改 */
router.post('/update', new TeacherAdviceController().update())

/* 删除 */
router.post('/delete', new TeacherAdviceController().del())

module.exports = router