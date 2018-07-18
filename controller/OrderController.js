const BaseController = require('./BaseController')
const Order = require('../model/Order')
const Member = require('../model/Member')
const Lesson = require('../model/Lesson')
const Product = require('../model/Product')
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
                        const products = await Product.findAll({
                            where: { name: { $like: '%' + keyword + '%' } },
                            attributes: ['productId']
                        })
                        if (products && products.length > 0) {
                            where['productId'] = { $in: products.map(item => item.productId) }
                        }
                    }
                }
                orders = await Order.findAndCountAll({
                    where, offset, limit: pageSize,
                    include: [
                        { model: Member, as: 'member' },
                        { model: Product, as: 'product' }
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
                if (!orderId) throw ('orderId不能为空！')
                const order = await Order.findById(orderId, {
                    include: [
                        { model: Member, as: 'member' },
                        { model: Product, as: 'product' }
                    ],
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
            const { productId } = ctx.request.body
            try {
                if (!productId) throw ('productId不能为空！')
                const product = await Product.findById(productId)
                if (product.type == 'lesson') {
                    const lessonId = snowflake.nextId()
                    await Lesson.create({
                        lessonId,
                        memberId,
                        productId,
                        totalNum: product.lessonNum,
                        validityDate: new Date(new Date().getTime() + product.validDate * 24 * 3600000)
                    })
                }
                const totalPrice = product.price
                const data = {
                    orderId,
                    memberId,
                    orderNo,
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