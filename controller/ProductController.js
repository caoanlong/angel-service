const BaseController = require('./BaseController')
const Product = require('../model/Product')
const SysDict = require('../model/SysDict')
const validator = require('validator')
const { snowflake } = require('../utils')

class ProductController extends BaseController {
	/**
	 * 根据条件分页查询列表
	 */
    findList() {
        return async ctx => {
            let { pageIndex = 1, pageSize = 10, type, name, labelId, startTime, endTime } = ctx.query
            pageIndex = Math.max(Number(pageIndex), 1)
            pageSize = Number(pageSize)
            const offset = (pageIndex - 1) * pageSize
            const where = {}
            if (type) where['type'] = type
            if (labelId) where['labelId'] = labelId
            if (name) where['name'] = { $like: '%' + name + '%' }
            if (startTime || endTime) where['createTime'] = {}
            if (startTime) where['createTime']['$gte'] = new Date(Number(startTime))
            if (endTime) where['createTime']['$lte'] = new Date(Number(endTime))
            try {
                const products = await Product.findAndCountAll({
                    where, offset, limit: pageSize,
                    order: [['createTime', 'DESC']],
                    include: [
                        { model: SysDict, as: 'expressType' },
                        { model: SysDict, as: 'label' }
                    ]
                })
                ctx.body = this.responseSussess({ pageIndex, pageSize, count: products.count, rows: products.rows })
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
            const { productId } = ctx.query
            try {
                if (validator.isEmpty(productId)) throw ('productId不能为空！')
                const product = await Product.findById(productId, {
                    include: [
                        { model: SysDict, as: 'expressType' },
                        { model: SysDict, as: 'label' }
                    ]
                })
                ctx.body = this.responseSussess(product)
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
            const productId = snowflake.nextId()
            const { type, name, labelId, image, freight, expressTypeId, lessonNum, price, validDate, remark } = ctx.request.body
            const data = {
                productId,
                type,
                name,
                labelId,
                image,
                freight,
                expressTypeId,
                lessonNum,
                price,
                validDate,
                remark,
                createBy: userId,
                createTime: new Date(),
                updateBy: userId,
                updateTime: new Date()
            }
            try {
                if (validator.isEmpty(type)) throw ('类型不能为空！')
                if (validator.isEmpty(name)) throw ('名称不能为空！')
                if (validator.isEmpty(price)) throw ('价格不能为空！')
                await Product.create(data)
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
            const { productId, name, labelId, image, freight, expressTypeId, lessonNum, price, validDate, remark } = ctx.request.body
            try {
                if (validator.isEmpty(productId)) throw ('productId不能为空！')
                const data = {
                    productId,
                    name,
                    labelId,
                    image,
                    freight,
                    expressTypeId,
                    lessonNum,
                    price,
                    validDate,
                    remark,
                    updateBy: userId,
                    updateTime: new Date()
                }
                await Product.update(data, { where: { productId } })
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
                await Product.destroy({ where: { productId: { $in: ids } } })
                ctx.body = this.responseSussess()
            } catch (err) {
                ctx.body = this.responseError(err)
            }
        }
    }
}

module.exports = ProductController