const Router = require('koa-router')
const router = new Router({ prefix: '/weixin' })
const WeixinController = require('../../controller/WeixinController')

router.get('/getOpenId', new WeixinController().getOpenId())

module.exports = router