const BaseController = require('./BaseController')
const HealthRecord = require('../model/HealthRecord')
const Member = require('../model/Member')
const Person = require('../model/Person')
const SysStore = require('../model/SysStore')
const SysDict = require('../model/SysDict')
const validator = require('validator')
const { snowflake } = require('../utils')

class HealthRecordController extends BaseController {
	/**
	 * 根据条件分页查询列表
	 */
	findList() {
		return async ctx => {
			let { pageIndex = 1, pageSize = 10, keyword, typeId, storeId, startTime, endTime } = ctx.query
			pageIndex = Math.max(Number(pageIndex), 1)
			pageSize = Number(pageSize)
			const offset = (pageIndex - 1) * pageSize
			const where = {}
			if (typeId) where['typeId'] = typeId
			if (storeId) where['storeId'] = storeId
			if (startTime || endTime) where['createTime'] = {}
			if (startTime) where['createTime']['$gte'] = new Date(Number(startTime))
			if (endTime) where['createTime']['$lte'] = new Date(Number(endTime))
			try {
				if (keyword) {
					const members = await Member.findAll({
						where: { name: { $like: '%' + keyword + '%' } },
						attributes: ['memberId']
					})
					if (members && members.length > 0) {
						where['memberId'] = { $in: members.map(item => item.memberId) }
					} else {
						const persons = await Person.findAll({
							where: { name: { $like: '%' + keyword + '%' } },
							attributes: ['personId']
						})
						if (persons && persons.length > 0) {
							where['memberId'] = { $in: persons.map(item => item.personId) }
						} else {
							where['name'] = { $like: '%' + keyword + '%' }
						}
					}
				}
				const healthRecords = await HealthRecord.findAndCountAll({
					where, offset, limit: pageSize,
					include: [
						{ model: Member, as: 'member' },
						{ model: Person, as: 'person' },
						{ model: SysDict, as: 'type' },
						{ model: SysStore, as: 'store' }
					],
					order: [['createTime', 'DESC']]
				})
				ctx.body = this.responseSussess({ pageIndex, pageSize, count: healthRecords.count, rows: healthRecords.rows })
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
			const { healthRecordId } = ctx.query
			try {
				if (!healthRecordId) throw ('healthRecordId不能为空！')
				const healthRecord = await HealthRecord.findById(healthRecordId, {
					include: [
						{ model: Member, as: 'member' },
						{ model: Person, as: 'person' },
						{ model: SysDict, as: 'type' },
						{ model: SysStore, as: 'store' }
					]
				})
				ctx.body = this.responseSussess(healthRecord)
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
			const healthRecordId = snowflake.nextId()
			const { name, memberId, personId, typeId, storeId, recordDate, file } = ctx.request.body
			const data = {
				healthRecordId,
				name,
				memberId,
				personId,
				typeId,
				storeId,
				recordDate,
				file,
				createBy: userId,
				createTime: new Date(), 
				updateBy: userId, 
				updateTime: new Date() 
			}
			try {
				if (!memberId) throw ('memberId不能为空！')
				if (!personId) throw ('personId不能为空！')
				if (!typeId) throw ('typeId不能为空！')
				await HealthRecord.create(data)
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
			const { healthRecordId, name, memberId, personId, typeId, storeId, recordDate, file } = ctx.request.body
			try {
				if (!healthRecordId) throw ('healthRecordId不能为空！')
				const data = {
					name,
					memberId,
					personId,
					typeId,
					storeId,
					recordDate,
					file, 
					updateBy: userId, 
					updateTime: new Date() 
				}
				await HealthRecord.update(data, { where: { healthRecordId } })
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
				await HealthRecord.destroy({ where: { healthRecordId: { $in: ids } } })
				ctx.body = this.responseSussess()
			} catch (err) {
				ctx.body = this.responseError(err)
			}
		}
	}
}

module.exports = HealthRecordController