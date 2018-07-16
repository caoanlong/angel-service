const BaseController = require('./BaseController')
const Lesson = require('../model/Lesson')
const LessonSet = require('../model/LessonSet')
const Member = require('../model/Member')
const SysDict = require('../model/SysDict')
const validator = require('validator')

class LessonController extends BaseController {
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
                        const lessonSets = await LessonSet.findAll({
                            where: { name: { $like: '%' + keyword + '%' } },
                            attributes: ['lessonSetId']
                        })
                        if (lessonSets && lessonSets.length > 0) {
                            where['lessonSetId'] = { $in: lessonSets.map(item => item.lessonSetId) }
                        }
                    }
                }
                lessons = await Lesson.findAndCountAll({
                    where, offset, limit: pageSize,
                    order: [['createTime', 'DESC']],
                    include: [
                        { model: Member, as: 'member' },
                        { 
                            model: LessonSet, as: 'lessonSet', 
                            include: [{ model: SysDict, as: 'type' }] 
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
                if (validator.isEmpty(lessonId)) throw ('lessonId不能为空！')
                const lesson = await Lesson.findById(lessonId, {
                    include: [
                        { model: Member, as: 'member' },
                        {
                            model: LessonSet, as: 'lessonSet',
                            include: [{ model: SysDict, as: 'type' }]
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