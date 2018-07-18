const Router = require('koa-router')
const router = new Router({ prefix: '/person' })
const PersonController = require('../../controller/PersonController')

/* 获取列表 */
router.get('/list', new PersonController().findList())

/* 获取详情 */
router.get('/info', new PersonController().findById())

/* 添加 */
router.post('/add', new PersonController().create())

/* 修改 */
router.post('/update', new PersonController().update())

/* 删除 */
router.post('/delete', new PersonController().del())

/* 搜索建议 */
router.get('/suggest', new PersonController().suggest())

module.exports = router