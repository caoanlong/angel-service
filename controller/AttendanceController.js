const BaseController = require('./BaseController')
const Attendance = require('../model/Attendance')
const Member = require('../model/Member')
const SysStore = require('../model/SysStore')
const Lesson = require('../model/Lesson')
const { snowflake } = require('../utils')

class AttendanceController extends BaseController {
	/**
	 * 根据条件分页查询列表
	 */
	findList() {
		return async ctx => {
			let { pageIndex = 1, pageSize = 10, keyword, storeId, status, startTime, endTime } = ctx.query
			pageIndex = Math.max(Number(pageIndex), 1)
			pageSize = Number(pageSize)
			const offset = (pageIndex - 1) * pageSize
			const where = {}
			if (storeId) where['storeId'] = storeId
			if (status) where['status'] = status
			if (startTime || endTime) where['createTime'] = {}
			if (startTime) where['createTime']['$gte'] = new Date(Number(startTime))
			if (endTime) where['createTime']['$lte'] = new Date(Number(endTime))
			let attendances = []
			try {
				if (keyword) {
					const members = await Member.findAll({
						where: {
							$or: {
								name: { $like: '%' + keyword + '%' },
								mobile: { $like: '%' + keyword + '%' }
							}
						},
						attributes: ['memberId']
					})
					if (members && members.length > 0) {
						where['memberId'] = { $in: members.map(item => item.memberId) }
					}
				}
				attendances = await Attendance.findAndCountAll({
					where, offset, limit: pageSize,
					include: [
						{ model: Member, as: 'member'},
						{ model: SysStore, as: 'store'}
					],
					order: [['createTime', 'DESC']]
				})
				ctx.body = this.responseSussess({ pageIndex, pageSize, count: attendances.count, rows: attendances.rows })
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
			const { attendanceId } = ctx.query
			try {
				if (!attendanceId) throw ('attendanceId不能为空！')
				const attendance = await Attendance.findById(attendanceId, {
					include: [
						{ model: Member, as: 'member'},
						{ model: SysStore, as: 'store'}
					]
				})
				ctx.body = this.responseSussess(attendance)
			} catch (err) {
				ctx.body = this.responseError(err)
			}
		}
	}
	/**
	 * 添加考勤
	 */
	create() {
		return async ctx => {
			const { memberId } = ctx.state.member || ctx.request.body
			const attendanceId = snowflake.nextId()
			try {
				const member = await Member.findById(memberId)
				const data = {
					attendanceId,
					memberId,
					storeId: member.storeId,
					createTime: new Date()
				}
				await Attendance.create(data)
				ctx.set({ 'response_code': 'OK' })
            	ctx.set({ 'trans_id': 'RTEnrollDataAction' })
				ctx.body = this.responseSussess()
			} catch (err) {
				ctx.body = this.responseError(err)
			}
		}
	}

	/**
	 * 考勤机操作
	 */
	createByAttendance(memberId) {
		return async ctx => {
			const attendanceId = snowflake.nextId()
			try {
				const member = await Member.findById(memberId)
				const data = {
					attendanceId,
					memberId,
					storeId: member.storeId,
					createTime: new Date()
				}
				await Attendance.create(data)
				ctx.set({ 'response_code': 'OK' })
            	ctx.set({ 'trans_id': 'RTEnrollDataAction' })
				ctx.body = this.responseSussess()
			} catch (err) {
				ctx.body = this.responseError(err)
			}
		}
	}

	/**
	 * 确认考勤
	 */
	confirmAttendance() {
		return async ctx => {
			const { attendanceId, lessonId } = ctx.request.body
			try {
				const data = {
					status: 'success',
					confirmTime: new Date()
				}
				const lesson = await Lesson.findById(lessonId)
				if (lesson.validityDate < new Date()) throw ('该会员课程已过期！')
				if (lesson.totalNum == lesson.num) throw ('该会员课程剩余课时不足！')
				await Attendance.update(data, { where: { attendanceId } })
				await Lesson.update({ num: lesson.num + 1 }, { where: { lessonId } })
				ctx.body = this.responseSussess()
			} catch (err) {
				ctx.body = this.responseError(err)
			}
		}
	}

	test() {
		return async ctx => {
			let data = {}
			if (ctx.request.method == 'GET') {
				data = ctx.query
			} else {
				data = ctx.request.body
			}
			ctx.body = data
		}
	}
}

module.exports = AttendanceController