const Router = require('koa-router')
const router = new Router({ prefix: '/product' })
const ProductController = require('../../controller/ProductController')

/* 获取列表 */
router.get('/list', new ProductController().findList())

/* 获取详情 */
router.get('/info', new ProductController().findById())

/* 添加 */
router.post('/add', new ProductController().create())

/* 修改 */
router.post('/update', new ProductController().update())

/* 删除 */
router.post('/delete', new ProductController().del())

module.exports = router