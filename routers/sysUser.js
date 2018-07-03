const Router = require('koa-router')
const router = new Router({prefix: '/sysUser'})
const SysUserController = require('../controller/SysUserController')

/* 获取用户列表 */
router.get('/list', SysUserController.findList())

/* 获取用户详情 */
router.get('/info', SysUserController.findById())

/* 添加用户 */
router.post('/add', SysUserController.create())

/* 修改用户 */
router.post('/update', SysUserController.update())

/* 删除用户 */
router.post('/delete', SysUserController.del())

module.exports = router