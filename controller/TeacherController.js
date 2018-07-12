const BaseController = require('./BaseController')
const Teacher = require('../model/Teacher')
const validator = require('validator')
const { snowflake } = require('../utils')

class TeacherController extends BaseController {
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
                const teachers = await Teacher.findAndCountAll({
                    where, offset, limit: pageSize,
                    order: [['createTime', 'DESC']]
                })
                ctx.body = this.responseSussess({ pageIndex, pageSize, count: teachers.count, rows: teachers.rows })
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
            const { teacherId } = ctx.query
            try {
                if (validator.isEmpty(teacherId)) throw ('teacherId不能为空！')
                const teacher = await Teacher.findById(teacherId)
                ctx.body = this.responseSussess(teacher)
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
            const teacherId = snowflake.nextId()
            const { name, mobile, avatar, remark } = ctx.request.body
            const data = {
                teacherId,
                name,
                mobile,
                avatar,
                remark,
                createBy: userId,
                createTime: new Date(),
                updateBy: userId,
                updateTime: new Date()
            }
            try {
                if (validator.isEmpty(name)) throw ('姓名不能为空！')
                if (validator.isEmpty(mobile)) throw ('手机号不能为空！')
                await Teacher.create(data)
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
            const { teacherId, name, mobile, avatar, remark } = ctx.request.body
            try {
                if (validator.isEmpty(teacherId)) throw ('teacherId不能为空！')
                const data = {
                    name,
                    mobile,
                    avatar,
                    remark,
                    updateBy: userId,
                    updateTime: new Date()
                }
                await Teacher.update(data, { where: { teacherId } })
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
                await Teacher.destroy({ where: { teacherId: { $in: ids } } })
                ctx.body = this.responseSussess()
            } catch (err) {
                ctx.body = this.responseError(err)
            }
        }
    }
}

module.exports = TeacherController