const Router = require('koa-router')
const router = new Router({prefix: '/sysMenu'})
const SysMenuController = require('../../controller/SysMenuController')

/* 获取所有菜单列表 */
router.get('/findListAll', new SysMenuController().findAllList())

/* 查询当前登录用户的权限菜单 */
router.get('/findListByUser', new SysMenuController().findUserMenuList())

/* 获取菜单详情 */
router.get('/info', new SysMenuController().findById())

/* 添加菜单 */
router.post('/add', new SysMenuController().create())

/* 修改菜单 */
router.post('/update', new SysMenuController().update())

/* 删除菜单 */
router.post('/delete', new SysMenuController().del())

module.exports = router