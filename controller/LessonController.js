const BaseController = require('./BaseController')
const Lesson = require('../model/Lesson')
const Product = require('../model/Product')
const Member = require('../model/Member')
const SysDict = require('../model/SysDict')
const SysStore = require('../model/SysStore')
const validator = require('validator')

class LessonController extends BaseController {
	/**
	 * 根据条件分页查询列表
	 */
	findList() {
		return async ctx => {
			let { pageIndex = 1, pageSize = 10, keyword, memberId, storeId, startTime, endTime } = ctx.query
			pageIndex = Math.max(Number(pageIndex), 1)
			pageSize = Number(pageSize)
			const offset = (pageIndex - 1) * pageSize
			const where = {}
			if (memberId) where['memberId'] = memberId
			if (storeId) where['storeId'] = storeId
			if (startTime || endTime) where['createTime'] = {}
			if (startTime) where['createTime']['$gte'] = new Date(Number(startTime))
			if (endTime) where['createTime']['$lte'] = new Date(Number(endTime))
			let lessons = []
			try {
				if (keyword) {
					const members = await Member.findAll({
						where: { name: { $like: '%' + keyword + '%' } },
						attributes: ['memberId']
					})
					if (members && members.length > 0) {
						where['memberId'] = { $in: members.map(item => item.memberId) }
					} else {
						const products = await Product.findAll({
							where: { name: { $like: '%' + keyword + '%' } },
							attributes: ['productId']
						})
						if (products && products.length > 0) {
							where['lessonSetId'] = { $in: products.map(item => item.productId) }
						}
					}
				}
				lessons = await Lesson.findAndCountAll({
					where, offset, limit: pageSize,
					order: [['createTime', 'DESC']],
					include: [
						{ model: Member, as: 'member' },
						{ model: SysStore, as: 'store' },
						{ 
							model: Product, as: 'product',
							include: [{ model: SysDict, as: 'label' }] 
						}
					]
				})
				ctx.body = this.responseSussess({ pageIndex, pageSize, count: lessons.count, rows: lessons.rows })
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
			const { lessonId } = ctx.query
			try {
				if (!lessonId) throw ('lessonId不能为空！')
				const lesson = await Lesson.findById(lessonId, {
					include: [
						{ model: Member, as: 'member' },
						{ model: SysStore, as: 'store' },
						{
							model: Product, as: 'product',
							include: [{ model: SysDict, as: 'label' }]
						}
					]
				})
				ctx.body = this.responseSussess(lesson)
			} catch (err) {
				ctx.body = this.responseError(err)
			}
		}
	}
}

module.exports = LessonController