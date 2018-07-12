const Router = require('koa-router')
const router = new Router({ prefix: '/platformProduct' })
const PlatformProductController = require('../../controller/PlatformProductController')

/* 获取列表 */
router.get('/list', new PlatformProductController().findList())

/* 获取详情 */
router.get('/info', new PlatformProductController().findById())

/* 添加 */
router.post('/add', new PlatformProductController().create())

/* 修改 */
router.post('/update', new PlatformProductController().update())

/* 删除 */
router.post('/delete', new PlatformProductController().del())

module.exports = router