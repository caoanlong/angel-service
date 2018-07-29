const Router = require('koa-router')
const router = new Router({ prefix: '/person' })
const PersonController = require('../../controller/PersonController')

/* 获取列表 */
router.get('/list', new PersonController().findList())

/* 获取详情 */
router.get('/info', new PersonController().findById())

/* 搜索建议 */
router.get('/suggest', new PersonController().suggest())

module.exports = router