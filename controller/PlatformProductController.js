const BaseController = require('./BaseController')
const PlatformProduct = require('../model/PlatformProduct')
const SysDict = require('../model/SysDict')
const validator = require('validator')
const { snowflake } = require('../utils')

class PlatformProductController extends BaseController {
	/**
	 * 根据条件分页查询列表
	 */
	findList() {
		return async ctx => {
			let { pageIndex = 1, pageSize = 10, name, startTime, endTime } = ctx.query
			pageIndex = Math.max(Number(pageIndex), 1)
			pageSize = Number(pageSize)
			const offset = (pageIndex - 1) * pageSize
			const where = {}
			if (name) where['name'] = { $like: '%' + name + '%' }
			if (startTime || endTime) where['createTime'] = {}
			if (startTime) where['createTime']['$gte'] = new Date(Number(startTime))
			if (endTime) where['createTime']['$lte'] = new Date(Number(endTime))
			try {
				const platformProducts = await PlatformProduct.findAndCountAll({
					where, offset, limit: pageSize,
					order: [['createTime', 'DESC']],
					include: [{ model: SysDict, as: 'expressType' }]
				})
				ctx.body = this.responseSussess({ pageIndex, pageSize, count: platformProducts.count, rows: platformProducts.rows })
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
			const { platformProductId } = ctx.query
			try {
				if (validator.isEmpty(platformProductId)) throw ('platformProductId不能为空！')
				const platformProduct = await PlatformProduct.findById(platformProductId, {include: [{ model: SysDict, as: 'expressType' }]})
				ctx.body = this.responseSussess(platformProduct)
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
			const platformProductId = snowflake.nextId()
			const { name, image, freight, expressTypeId, price, remark } = ctx.request.body
			const data = {
				platformProductId,
				name,
				image,
				freight,
				expressTypeId,
				price,
				remark,
				createBy: userId,
				createTime: new Date(),
				updateBy: userId,
				updateTime: new Date()
			}
			try {
				if (validator.isEmpty(name)) throw ('名称不能为空！')
				if (validator.isEmpty(expressTypeId)) throw ('快递类型不能为空！')
				if (validator.isEmpty(price)) throw ('价格不能为空！')
				await PlatformProduct.create(data)
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
			const { platformProductId, name, image, freight, expressTypeId, price, remark } = ctx.request.body
			try {
				if (validator.isEmpty(platformProductId)) throw ('platformProductId不能为空！')
				const data = {
					name,
					image,
					freight,
					expressTypeId,
					price,
					remark,
					updateBy: userId,
					updateTime: new Date()
				}
				await PlatformProduct.update(data, { where: { platformProductId } })
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
				await PlatformProduct.destroy({ where: { platformProductId: { $in: ids } } })
				ctx.body = this.responseSussess()
			} catch (err) {
				ctx.body = this.responseError(err)
			}
		}
	}
}

module.exports = PlatformProductController