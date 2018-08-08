const BaseController = require('./BaseController')
const Person = require('../model/Person')
const SysStore = require('../model/SysStore')
const validator = require('validator')
const { snowflake } = require('../utils')

class PersonController extends BaseController {
	/**
	 * 根据条件分页查询列表
	 */
	findList() {
		return async ctx => {
			let { pageIndex = 1, pageSize = 10, type, keyword, storeId, startTime, endTime } = ctx.query
			pageIndex = Math.max(Number(pageIndex), 1)
			pageSize = Number(pageSize)
			const offset = (pageIndex - 1) * pageSize
			const where = {}
			if (type) where['type'] = type
			if (storeId) where['storeId'] = storeId
			if (keyword) {
				where['$or'] = {}
				where['$or']['name'] = { $like: '%' + keyword + '%' }
				where['$or']['mobile'] = { $like: '%' + keyword + '%' }
			}
			if (startTime || endTime) where['createTime'] = {}
			if (startTime) where['createTime']['$gte'] = new Date(Number(startTime))
			if (endTime) where['createTime']['$lte'] = new Date(Number(endTime))
			try {
				const persons = await Person.findAndCountAll({
					where, offset, limit: pageSize,
					include: [{ model: SysStore, as: 'store' }],
					order: [['createTime', 'DESC']]
				})
				ctx.body = this.responseSussess({ pageIndex, pageSize, count: persons.count, rows: persons.rows })
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
			const { personId } = ctx.query
			try {
				if (!personId) throw ('personId不能为空！')
				const person = await Person.findById(personId, {
					include: [{ model: SysStore, as: 'store' }]
				})
				ctx.body = this.responseSussess(person)
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
			const { type, name, mobile, avatar, sex, age, storeId, remark } = ctx.request.body
			const data = {
				type,
				name,
				mobile,
				avatar,
				sex,
				age,
				storeId,
				remark,
				createBy: userId,
				createTime: new Date(),
				updateBy: userId,
				updateTime: new Date()
			}
			try {
				if (!name) throw ('姓名不能为空！')
				if (!mobile) throw ('手机号不能为空！')
				await Person.create(data)
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
			const { personId, name, mobile, avatar, sex, age, storeId, remark } = ctx.request.body
			try {
				if (!personId) throw ('personId不能为空！')
				const data = {
					name,
					mobile,
					avatar,
					sex,
					age,
					storeId,
					remark,
					updateBy: userId,
					updateTime: new Date()
				}
				await Person.update(data, { where: { personId } })
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
				await Person.destroy({ where: { personId: { $in: ids } } })
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
			const { type, keyword } = ctx.query
			const where = {}
			if (type) where['type'] = type
			if (keyword) where['name'] = { $like: '%' + keyword + '%' }
			try {
				const persons = await Person.findAll({ where })
				ctx.body = this.responseSussess(persons)
			} catch (err) {
				ctx.body = this.responseError(err)
			}
		}
	}
}

module.exports = PersonController