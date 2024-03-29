const BaseController = require('./BaseController')
const SysDict = require('../model/SysDict')
const validator = require('validator')
const { snowflake } = require('../utils')

class SysDictController extends BaseController {
	/**
	 * 根据条件分页查询列表
	 */
	findList() {
		return async ctx => {
			let { pageIndex = 1, pageSize = 10, description, type, startTime, endTime } = ctx.query
			pageIndex = Math.max( Number(pageIndex), 1 )
			pageSize = Number(pageSize)
			const offset = (pageIndex - 1) * pageSize
			const where = {}
			if (description) where['description'] = { $like: '%' + description + '%' }
			if (type) where['type'] = type
			if (startTime || endTime) where['createTime'] = {}
			if (startTime) where['createTime']['$gte'] = new Date(Number(startTime))
			if (endTime) where['createTime']['$lte'] = new Date(Number(endTime))
			try {
				const sysDicts = await SysDict.findAndCountAll({ where, offset, limit: pageSize, order: [ ['createTime', 'DESC'] ] })
				ctx.body = this.responseSussess({ pageIndex, pageSize, count: sysDicts.count, rows: sysDicts.rows })
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
			const { dictId } = ctx.query
			try {
				if (!dictId) throw('dictId不能为空！')
				const sysDict = await SysDict.findById(dictId)
				ctx.body = this.responseSussess(sysDict)
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
			const { key, value, type, sort, description } = ctx.request.body
			const data = {
				key,
				value,
				type,
				sort,
				description,
				createBy: userId, 
				createTime: new Date(), 
				updateBy: userId, 
				updateTime: new Date() 
			}
			try {
				if (!key) throw('键名不能为空！')
				if (!value) throw('值不能为空！')
				if (!type) throw('类型不能为空！')
				await SysDict.create(data)
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
			const { dictId, key, value, type, sort, description } = ctx.request.body
			try {
				if (!dictId) throw('dictId不能为空！')
				const data = { 
					dictId, 
					key,
					value,
					type,
					sort,
					description,
					updateBy: userId, 
					updateTime: new Date() 
				}
				await SysDict.update(data, { where: { dictId } })
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
				if (!ids || ids.length == 0) throw('ids不能为空！')
				await SysDict.destroy({ where: { dictId: { $in: ids }}})
				ctx.body = this.responseSussess()
			} catch (err) {
				ctx.body = this.responseError(err)
			}
		}
	}
	/**
	 * groupBy查询所有类别
	 */
	findTypeList() {
		return async ctx => {
			try {
				const sysDicts = await SysDict.findAll({ attributes: ['type', 'description'], group: ['type'] })
				ctx.body = this.responseSussess(sysDicts)
			} catch (err) {
				ctx.body = this.responseError(err)
			}
		}
	}

	findListByType() {
		return async ctx => {
			const { type } = ctx.query
			try {
				const sysDicts = await SysDict.findAll({ where: { type }})
				ctx.body = this.responseSussess(sysDicts)
			} catch (err) {
				ctx.body = this.responseError(err)
			}
		}
	}
}

module.exports = SysDictController