const Router = require('koa-router')
const router = new Router({prefix: '/sysDict'})
const SysDictController = require('../../controller/SysDictController')

/* 获取字典列表 */
router.get('/list', new SysDictController().findList())

/* 获取字典详情 */
router.get('/info', new SysDictController().findById())

/* 添加字典 */
router.post('/add', new SysDictController().create())

/* 修改字典 */
router.post('/update', new SysDictController().update())

/* 删除字典 */
router.post('/delete', new SysDictController().del())

/* 查询所有类型 */
router.get('/types', new SysDictController().findTypeList())

module.exports = router