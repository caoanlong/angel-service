const Router = require('koa-router')
const router = new Router({ prefix: '/member' })
const MemberController = require('../../controller/MemberController')

/* 获取列表 */
router.get('/list', new MemberController().findList())

/* 获取详情 */
router.get('/info', new MemberController().findById())

/* 添加 */
router.post('/add', new MemberController().create())

/* 修改 */
router.post('/update', new MemberController().update())

/* 删除 */
router.post('/delete', new MemberController().del())

/* 禁用 */
router.post('/disable', new MemberController().disable())

/* 搜索建议 */
router.post('/suggest', new MemberController().suggest())

module.exports = router