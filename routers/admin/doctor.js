const Router = require('koa-router')
const router = new Router({ prefix: '/doctor' })
const DoctorController = require('../../controller/DoctorController')

/* 获取列表 */
router.get('/list', new DoctorController().findList())

/* 获取详情 */
router.get('/info', new DoctorController().findById())

/* 添加 */
router.post('/add', new DoctorController().create())

/* 修改 */
router.post('/update', new DoctorController().update())

/* 删除 */
router.post('/delete', new DoctorController().del())

/* 搜索建议 */
router.post('/suggest', new DoctorController().suggest())

module.exports = router