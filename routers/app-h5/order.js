const Router = require('koa-router')
const router = new Router({ prefix: '/order' })
const OrderController = require('../../controller/OrderController')

/* 获取列表 */
router.get('/list', new OrderController().findList())

/* 获取详情 */
router.get('/info', new OrderController().findById())

/* 添加 */
router.post('/add', new OrderController().create())

module.exports = router