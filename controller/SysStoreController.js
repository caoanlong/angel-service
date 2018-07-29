const BaseController = require('./BaseController')
const SysStore = require('../model/SysStore')
const validator = require('validator')
const { snowflake } = require('../utils')

class SysStoreController extends BaseController {
	/**
	 * 根据条件分页查询列表
	 */
	findList() {
		return async ctx => {
			let { pageIndex = 1, pageSize = 10, keyword, startTime, endTime } = ctx.query
			pageIndex = Math.max(Number(pageIndex), 1)
			pageSize = Number(pageSize)
			const offset = (pageIndex - 1) * pageSize
			const where = {}
			if (keyword) {
				where['$or'] = {}
				where['$or']['name'] = { $like: '%' + keyword + '%' }
				where['$or']['mobile'] = { $like: '%' + keyword + '%' }
			}
			if (startTime || endTime) where['createTime'] = {}
			if (startTime) where['createTime']['$gte'] = new Date(Number(startTime))
			if (endTime) where['createTime']['$lte'] = new Date(Number(endTime))
			try {
				const sysStores = await SysStore.findAndCountAll({
					where, offset, limit: pageSize,
					order: [['createTime', 'DESC']]
				})
				ctx.body = this.responseSussess({ pageIndex, pageSize, count: sysStores.count, rows: sysStores.rows })
			} catch (err) {
				ctx.body = this.responseError(err)
			}
		}
	}
	/**
	 * 根据Id查询详情
	 */
	findById() {
		return async ctx => {
			const { storeId } = ctx.query
			try {
				if (!storeId) throw ('storeId不能为空！')
				const sysStore = await SysStore.findById(storeId)
				ctx.body = this.responseSussess(sysStore)
			} catch (err) {
				ctx.body = this.responseError(err)
			}
		}
	}
	/**
	 * 添加
	 */
	create() {
		return async ctx => {
			const userId = ctx.state.user.userId
			const { name, mobile, logo, remark } = ctx.request.body
			const data = {
				name,
				mobile,
				logo,
				remark,
				createBy: userId,
				createTime: new Date(),
				updateBy: userId,
				updateTime: new Date()
			}
			try {
				if (!name) throw ('名称不能为空！')
				await SysStore.create(data)
				ctx.body = this.responseSussess()
			} catch (err) {
				ctx.body = this.responseError(err)
			}
		}
	}
	/**
	 * 修改
	 */
	update() {
		return async ctx => {
			const userId = ctx.state.user.userId
			const { storeId, name, mobile, logo, remark } = ctx.request.body
			try {
				if (!storeId) throw ('storeId不能为空！')
				const data = {
					name,
					mobile,
					logo,
					remark,
					updateBy: userId,
					updateTime: new Date()
				}
				await SysStore.update(data, { where: { storeId } })
				ctx.body = this.responseSussess()
			} catch (err) {
				ctx.body = this.responseError(err)
			}
		}
	}
	/**
	 * 删除
	 */
	del() {
		return async ctx => {
			const { ids } = ctx.request.body
			try {
				if (!ids || ids.length == 0) throw ('ids不能为空！')
				await SysStore.destroy({ where: { storeId: { $in: ids } } })
				ctx.body = this.responseSussess()
			} catch (err) {
				ctx.body = this.responseError(err)
			}
		}
	}
	/**
	* 搜索建议
	*/
	suggest() {
		return async ctx => {
			const { keyword } = ctx.query
			const where = {}
			if (keyword) where['name'] = { $like: '%' + keyword + '%' }
			try {
				const sysStores = await SysStore.findAll({ where })
				ctx.body = this.responseSussess(persons)
			} catch (err) {
				ctx.body = this.responseError(err)
			}
		}
	}
}

module.exports = SysStoreController