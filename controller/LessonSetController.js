const BaseController = require('./BaseController')
const LessonSet = require('../model/LessonSet')
const SysDict = require('../model/SysDict')
const validator = require('validator')
const { snowflake } = require('../utils')

class LessonSetController extends BaseController {
	/**
	 * 根据条件分页查询列表
	 */
	findList() {
		return async ctx => {
			let { pageIndex = 1, pageSize = 10, name, typeId, startTime, endTime } = ctx.query
			pageIndex = Math.max(Number(pageIndex), 1)
			pageSize = Number(pageSize)
			const offset = (pageIndex - 1) * pageSize
			const where = {}
			if (name) where['name'] = { $like: '%' + name + '%' }
			if (typeId) where['typeId'] = typeId
			if (startTime || endTime) where['createTime'] = {}
			if (startTime) where['createTime']['$gte'] = new Date(Number(startTime))
			if (endTime) where['createTime']['$lte'] = new Date(Number(endTime))
			try {
				const lessonSets = await LessonSet.findAndCountAll({
					where, offset, limit: pageSize,
					order: [['createTime', 'DESC']],
					include: [
						{ model: SysDict, as: 'type' },
						{ model: SysDict, as: 'validDate' }
					]
				})
				ctx.body = this.responseSussess({ pageIndex, pageSize, count: lessonSets.count, rows: lessonSets.rows })
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
			const { lessonSetId } = ctx.query
			try {
				if (validator.isEmpty(lessonSetId)) throw ('lessonSetId不能为空！')
				const lessonSet = await LessonSet.findById(lessonSetId, {
					include: [
						{ model: SysDict, as: 'type' },
						{ model: SysDict, as: 'validDate' }
					]
				})
				ctx.body = this.responseSussess(lessonSet)
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
			const lessonSetId = snowflake.nextId()
			const { name, image, typeId, num, price, validityDate, remark } = ctx.request.body
			const data = {
				lessonSetId,
				name,
				image,
				typeId,
				num,
				price,
				validityDate,
				remark,
				createBy: userId,
				createTime: new Date(),
				updateBy: userId,
				updateTime: new Date()
			}
			try {
				if (validator.isEmpty(name)) throw ('名称不能为空！')
				if (validator.isEmpty(typeId)) throw ('类型不能为空！')
				if (validator.isEmpty(price)) throw ('价格不能为空！')
				if (validator.isEmpty(validityDate)) throw ('有效期不能为空！')
				await LessonSet.create(data)
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
			const { lessonSetId, name, image, num, typeId, price, validityDate, remark } = ctx.request.body
			try {
				if (validator.isEmpty(lessonSetId)) throw ('lessonSetId不能为空！')
				const data = {
					name,
					image,
					num,
					typeId,
					price,
					validityDate,
					remark,
					updateBy: userId,
					updateTime: new Date()
				}
				await LessonSet.update(data, { where: { lessonSetId } })
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
				await LessonSet.destroy({ where: { lessonSetId: { $in: ids } } })
				ctx.body = this.responseSussess()
			} catch (err) {
				ctx.body = this.responseError(err)
			}
		}
	}
}

module.exports = LessonSetController