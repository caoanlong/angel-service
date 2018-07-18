const BaseController = require('./BaseController')
const Attendance = require('../model/Attendance')
const Member = require('../model/Member')
const validator = require('validator')
const { snowflake } = require('../utils')

class AttendanceController extends BaseController {
	/**
	 * 根据条件分页查询列表
	 */
    findList() {
        return async ctx => {
            let { pageIndex = 1, pageSize = 10, keyword, status, startTime, endTime } = ctx.query
            pageIndex = Math.max(Number(pageIndex), 1)
            pageSize = Number(pageSize)
            const offset = (pageIndex - 1) * pageSize
            const where = {}
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
                    include: [{ model: Member, as: 'member' }],
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
                if (validator.isEmpty(attendanceId)) throw ('attendanceId不能为空！')
                const attendance = await Attendance.findById(attendanceId, {
                    include: [{ model: Member, as: 'member' }]
                })
                ctx.body = this.responseSussess(attendance)
            } catch (err) {
                ctx.body = this.responseError(err)
            }
        }
    }
	/**
	 * 添加(考勤打卡)
	 */
    create() {
        return async ctx => {
            const memberId = ctx.state.member.memberId
            const attendanceId = snowflake.nextId()
            try {
                const data = {
                    attendanceId,
                    memberId,
                    status: 'success',
                    createTime: new Date()
                }
                await Attendance.create(data)
                ctx.body = this.responseSussess()
            } catch (err) {
                ctx.body = this.responseError(err)
            }
        }
    }
}

module.exports = AttendanceController