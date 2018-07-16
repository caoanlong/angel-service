const BaseController = require('./BaseController')
const Order = require('../model/Order')
const Member = require('../model/Member')
const Lesson = require('../model/Lesson')
const LessonSet = require('../model/LessonSet')
const PlatformProduct = require('../model/PlatformProduct')
const validator = require('validator')
const { snowflake, generateOrderNo } = require('../utils')

class OrderController extends BaseController {
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
            let orders = []
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
                        } else {
                            const products = await PlatformProduct.findAll({
                                where: { name: { $like: '%' + keyword + '%' } },
                                attributes: ['platformProductId']
                            })
                            if (products && products.length > 0) {
                                where['productId'] = { $in: products.map(item => item.platformProductId) }
                            }
                        }
                    }
                }
                orders = await Order.findAndCountAll({
                    where, offset, limit: pageSize,
                    include: [
                        { model: Member, as: 'member' },
                        { model: LessonSet, as: 'lessonSet' },
                        { model: PlatformProduct, as: 'product' }
                    ],
                    order: [['createTime', 'DESC']]
                })
                ctx.body = this.responseSussess({ pageIndex, pageSize, count: orders.count, rows: orders.rows })
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
            const { orderId } = ctx.query
            try {
                if (validator.isEmpty(orderId)) throw ('orderId不能为空！')
                const order = await Order.findById(orderId, {
                    include: [
                        { model: Member, as: 'member' },
                        { model: LessonSet, as: 'lessonSet' },
                        { model: PlatformProduct, as: 'product' }
                    ]
                })
                ctx.body = this.responseSussess(order)
            } catch (err) {
                ctx.body = this.responseError(err)
            }
        }
    }
	/**
	 * 添加(提交生成订单)
	 */
    create() {
        return async ctx => {
            const memberId = ctx.state.member.memberId
            const orderId = snowflake.nextId()
            const orderNo = generateOrderNo(4)
            const { lessonSetId = null, productId = null, totalPrice } = ctx.request.body
            try {
                if (lessonSetId) {
                    const lessonSet = await LessonSet.findById(lessonSetId)
                    totalPrice = lessonSet.price
                    const lessonId = snowflake.nextId()
                    await Lesson.create({
                        lessonId,
                        memberId,
                        lessonSetId,
                        totalNum: lessonSet.num,
                        validityDate: new Date(new Date().getTime() + lessonSet.validityDate * 24 * 3600000)
                    })
                }
                if (productId) {
                    const product = await PlatformProduct.findById(productId)
                    totalPrice = product.price
                }
                const data = {
                    orderId,
                    memberId,
                    orderNo,
                    lessonSetId,
                    productId,
                    totalPrice,
                    status: 'success',
                    createTime: new Date()
                }
                await Order.create(data)
                ctx.body = this.responseSussess()
            } catch (err) {
                ctx.body = this.responseError(err)
            }
        }
    }
}

module.exports = OrderController