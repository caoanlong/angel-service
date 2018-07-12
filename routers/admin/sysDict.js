const Router = require('koa-router')
const router = new Router({prefix: '/sysDict'})
const SysDictController = require('../../controller/SysDictController')

/* 获取列表 */
router.get('/list', new SysDictController().findList())

/* 获取详情 */
router.get('/info', new SysDictController().findById())

/* 添加 */
router.post('/add', new SysDictController().create())

/* 修改 */
router.post('/update', new SysDictController().update())

/* 删除 */
router.post('/delete', new SysDictController().del())

/* 查询所有类型 */
router.get('/types', new SysDictController().findTypeList())

/* 根据类型获取列表 */
router.get('/findListByType', new SysDictController().findListByType())

module.exports = router