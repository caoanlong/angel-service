const BaseController = require('./BaseController')
const AngelRemark = require('../model/AngelRemark')
const Person = require('../model/Person')
const validator = require('validator')
const { snowflake } = require('../utils')

class AngelRemarkController extends BaseController {
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
                const angelRemarks = await AngelRemark.findAndCountAll({
                    where, offset, limit: pageSize,
                    order: [['createTime', 'DESC']]
                })
                ctx.body = this.responseSussess({ pageIndex, pageSize, count: angelRemarks.count, rows: angelRemarks.rows })
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
            const { angelRemarkId } = ctx.query
            try {
                if (!angelRemarkId) throw ('angelRemarkId不能为空！')
                const angelRemark = await AngelRemark.findById(angelRemarkId)
                ctx.body = this.responseSussess(angelRemark)
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
            const memberId = ctx.state.member.memberId
            const angelRemarkId = snowflake.nextId()
            const { personId, remark } = ctx.request.body
            const data = {
                angelRemarkId,
                memberId,
                personId,
                remark,
                createTime: new Date(),
                updateTime: new Date()
            }
            try {
                if (!personId) throw ('personId不能为空！')
                await AngelRemark.create(data)
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
            const { angelRemarkId, personId, remark } = ctx.request.body
            try {
                if (!angelRemarkId) throw ('angelRemarkId不能为空！')
                const data = {
                    personId,
                    remark,
                    updateTime: new Date()
                }
                await AngelRemark.update(data, { where: { angelRemarkId } })
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
                await AngelRemark.destroy({ where: { angelRemarkId: { $in: ids } } })
                ctx.body = this.responseSussess()
            } catch (err) {
                ctx.body = this.responseError(err)
            }
        }
    }
}

module.exports = AngelRemarkController