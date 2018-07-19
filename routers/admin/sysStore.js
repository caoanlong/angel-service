const Router = require('koa-router')
const router = new Router({ prefix: '/sysStore' })
const SysStoreController = require('../../controller/SysStoreController')

/* 获取列表 */
router.get('/list', new SysStoreController().findList())

/* 获取详情 */
router.get('/info', new SysStoreController().findById())

/* 添加 */
router.post('/add', new SysStoreController().create())

/* 修改 */
router.post('/update', new SysStoreController().update())

/* 删除 */
router.post('/delete', new SysStoreController().del())

/* 搜索建议 */
router.get('/suggest', new SysStoreController().suggest())

module.exports = router