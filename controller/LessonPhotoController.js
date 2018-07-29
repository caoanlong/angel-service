const BaseController = require('./BaseController')
const LessonPhoto = require('../model/LessonPhoto')
const Member = require('../model/Member')
const SysStore = require('../model/SysStore')
const validator = require('validator')
const { snowflake } = require('../utils')

class LessonPhotoController extends BaseController {
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
                        where['title'] = { $like: '%' + keyword + '%' }
                    }
                }
                const lessonPhotos = await LessonPhoto.findAndCountAll({
                    where, offset, limit: pageSize,
                    include: [
                        { model: Member, as: 'member' },
                        { model: SysStore, as: 'store' }
                    ],
                    order: [['createTime', 'DESC']]
                })
                ctx.body = this.responseSussess({ pageIndex, pageSize, count: lessonPhotos.count, rows: lessonPhotos.rows })
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
            const { lessonPhotoId } = ctx.query
            try {
                if (!lessonPhotoId) throw ('lessonPhotoId不能为空！')
                const lessonPhoto = await LessonPhoto.findById(lessonPhotoId, {
                    include: [
                        { model: Member, as: 'member' },
                        { model: SysStore, as: 'store' }
                    ]
                })
                ctx.body = this.responseSussess(lessonPhoto)
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
            const lessonPhotoId = snowflake.nextId()
            const { memberId, title, photos, storeId } = ctx.request.body
            const data = {
                lessonPhotoId,
                memberId,
                title,
                photos,
                storeId,
                createBy: userId,
                createTime: new Date(),
                updateBy: userId,
                updateTime: new Date()
            }
            try {
                if (!memberId) throw ('memberId不能为空！')
                if (!photos) throw ('照片不能为空！')
                await LessonPhoto.create(data)
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
            const { lessonPhotoId, memberId, title, photos, storeId } = ctx.request.body
            try {
                if (!lessonPhotoId) throw ('lessonPhotoId不能为空！')
                const data = {
                    memberId,
                    title,
                    photos,
                    storeId,
                    updateBy: userId,
                    updateTime: new Date()
                }
                await LessonPhoto.update(data, { where: { lessonPhotoId } })
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
                await LessonPhoto.destroy({ where: { lessonPhotoId: { $in: ids } } })
                ctx.body = this.responseSussess()
            } catch (err) {
                ctx.body = this.responseError(err)
            }
        }
    }
}

module.exports = LessonPhotoController