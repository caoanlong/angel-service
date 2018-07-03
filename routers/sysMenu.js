const Router = require('koa-router')
const router = new Router({prefix: '/sysMenu'})
const SysMenuController = require('../controller/SysMenuController')

/* 获取所有菜单列表 */
router.get('/findListAll', SysMenuController.findAllList())

/* 查询当前登录用户的权限菜单 */
router.get('/findListByUser', SysMenuController.findUserMenuList())

/* 获取菜单详情 */
router.get('/info', SysMenuController.findById())

/* 添加菜单 */
router.post('/add', SysMenuController.create())

/* 修改菜单 */
router.post('/update', SysMenuController.update())

/* 删除菜单 */
router.post('/delete', SysMenuController.del())

module.exports = router