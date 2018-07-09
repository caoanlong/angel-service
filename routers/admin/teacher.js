const Router = require('koa-router')
const router = new Router({ prefix: '/teacher' })
const TeacherController = require('../../controller/TeacherController')

/* 获取列表 */
router.get('/list', new TeacherController().findList())

/* 获取详情 */
router.get('/info', new TeacherController().findById())

/* 添加 */
router.post('/add', new TeacherController().create())

/* 修改 */
router.post('/update', new TeacherController().update())

/* 删除 */
router.post('/delete', new TeacherController().del())

module.exports = router