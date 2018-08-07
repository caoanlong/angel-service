const Router = require('koa-router')
const router = new Router({ prefix: '/attendance' })
const AttendanceController = require('../../controller/AttendanceController')

/* 获取列表 */
router.get('/list', new AttendanceController().findList())

/* 获取详情 */
router.get('/info', new AttendanceController().findById())

/* 添加 */
router.post('/add', new AttendanceController().create())

/* 测试 */
router.all('/test', new AttendanceController().test())

module.exports = router