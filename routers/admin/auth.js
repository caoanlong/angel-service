const Router = require('koa-router')
const router = new Router({prefix: '/auth'})
const SysUserController = require('../../controller/SysUserController')

/* 获取用户详情 */
router.get('/info', new SysUserController().findByToken())

/* 登录 */
router.post('/login', new SysUserController().login())

module.exports = router