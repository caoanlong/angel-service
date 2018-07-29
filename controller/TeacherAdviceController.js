const BaseController = require('./BaseController')
const TeacherAdvice = require('../model/TeacherAdvice')
const Member = require('../model/Member')
const Person = require('../model/Person')
const SysStore = require('../model/SysStore')
const validator = require('validator')
const { snowflake } = require('../utils')

class TeacherAdviceController extends BaseController {
	/**
	 * 根据条件分页查询列表
	 */
    findList() {
        return async ctx => {
            let { pageIndex = 1, pageSize = 10, keyword, storeId, startTime, endTime } = ctx.query
            pageIndex = Math.max(Number(pageIndex), 1)
            pageSize = Number(pageSize)
            const offset = (pageIndex - 1) * pageSize
            const where = {}
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
                            where['remark'] = { $like: '%' + keyword + '%' }
                        }
                    }
                }
                const teacherAdvices = await TeacherAdvice.findAndCountAll({
                    where, offset, limit: pageSize,
                    include: [
                        { model: Member, as: 'member' },
                        { model: Person, as: 'person' },
                        { model: SysStore, as: 'store' }
                    ],
                    order: [['createTime', 'DESC']]
                })
                ctx.body = this.responseSussess({ pageIndex, pageSize, count: teacherAdvices.count, rows: teacherAdvices.rows })
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
            const { teacherAdviceId } = ctx.query
            try {
                if (!teacherAdviceId) throw ('teacherAdviceId不能为空！')
                const teacherAdvice = await TeacherAdvice.findById(teacherAdviceId, {
                    include: [
                        { model: Member, as: 'member' },
                        { model: Person, as: 'person' },
                        { model: SysStore, as: 'store' }
                    ]
                })
                ctx.body = this.responseSussess(teacherAdvice)
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
            const teacherAdviceId = snowflake.nextId()
            const { memberId, personId, storeId, remark } = ctx.request.body
            const data = {
                teacherAdviceId,
                memberId,
                personId,
                storeId,
                remark,
                createBy: userId,
                createTime: new Date(),
                updateBy: userId,
                updateTime: new Date()
            }
            try {
                if (!memberId) throw ('memberId不能为空！')
                if (!personId) throw ('personId不能为空！')
                await TeacherAdvice.create(data)
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
            const { teacherAdviceId, memberId, personId, storeId, remark } = ctx.request.body
            try {
                if (!teacherAdviceId) throw ('teacherAdviceId不能为空！')
                const data = {
                    memberId,
                    personId,
                    storeId,
                    remark,
                    updateBy: userId,
                    updateTime: new Date()
                }
                await TeacherAdvice.update(data, { where: { teacherAdviceId } })
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
                await TeacherAdvice.destroy({ where: { teacherAdviceId: { $in: ids } } })
                ctx.body = this.responseSussess()
            } catch (err) {
                ctx.body = this.responseError(err)
            }
        }
    }
}

module.exports = TeacherAdviceController