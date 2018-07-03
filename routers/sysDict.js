const Router = require('koa-router')
const router = new Router({prefix: '/sysDict'})
const SysDictController = require('../controller/SysDictController')

/* 获取字典列表 */
router.get('/list', SysDictController.findList())

/* 获取字典详情 */
router.get('/info', SysDictController.findById())

/* 添加字典 */
router.post('/add', SysDictController.create())

/* 修改字典 */
router.post('/update', SysDictController.update())

/* 删除字典 */
router.post('/delete', SysDictController.del())

module.exports = router