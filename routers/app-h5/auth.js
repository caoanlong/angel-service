const Router = require('koa-router')
const router = new Router({ prefix: '/auth' })
const MemberController = require('../../controller/MemberController')
const CommonController = require('../../controller/CommonController')

/* 获取用户详情 */
router.get('/info', new MemberController().findByToken())

/* 修改资料 */
router.post('/updateByToken', new MemberController().updateByToken())

/* 修改手机号 */
router.post('/updateMobile', new MemberController().updateMobile())

/* 登录 */
router.post('/login', new MemberController().login())

/* 获取验证码 */
router.post('/getSmsCode', new CommonController().getSmsCode())

module.exports = router