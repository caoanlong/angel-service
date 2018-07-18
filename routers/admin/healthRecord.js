const Router = require('koa-router')
const router = new Router({ prefix: '/healthRecord' })
const HealthRecordController = require('../../controller/HealthRecordController')

/* 获取列表 */
router.get('/list', new HealthRecordController().findList())

/* 获取详情 */
router.get('/info', new HealthRecordController().findById())

/* 添加 */
router.post('/add', new HealthRecordController().create())

/* 修改 */
router.post('/update', new HealthRecordController().update())

/* 删除 */
router.post('/delete', new HealthRecordController().del())

module.exports = router