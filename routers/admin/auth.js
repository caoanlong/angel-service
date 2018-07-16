const Router = require('koa-router')
const router = new Router({prefix: '/auth'})
const SysUserController = require('../../controller/SysUserController')

/* 获取用户详情 */
router.get('/info', new SysUserController().findByToken())

/* 修改资料 */
router.post('/update', new SysUserController().updateByToken())

/* 修改密码 */
router.post('/updatePassword', new SysUserController().updatePassword())

/* 登录 */
router.post('/login', new SysUserController().login())

module.exports = router