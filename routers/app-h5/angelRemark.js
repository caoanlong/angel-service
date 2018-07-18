const Router = require('koa-router')
const router = new Router({ prefix: '/angelRemark' })
const AngelRemarkController = require('../../controller/AngelRemarkController')

/* 获取列表 */
router.get('/list', new AngelRemarkController().findList())

/* 获取详情 */
router.get('/info', new AngelRemarkController().findById())

/* 添加 */
router.post('/add', new AngelRemarkController().create())

/* 修改 */
router.post('/update', new AngelRemarkController().update())

/* 删除 */
router.post('/delete', new AngelRemarkController().del())

module.exports = router