const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

const Member = require('./Member')
const Product = require('./Product')

/* 订单 */
const Order = sequelize.define('orders', {
    // 订单ID
    orderId: {
        type: Sequelize.BIGINT(32),
        primaryKey: true,
        allowNull: false
    },
    // 会员ID
    memberId: {
        type: Sequelize.BIGINT(32),
        allowNull: false
    },
    // 订单号
    orderNo: {
        type: Sequelize.STRING(32),
        allowNull: false
    },
    // 产品ID
    productId: {
        type: Sequelize.BIGINT(32)
    },
    // 订单总价
    totalPrice: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    // 状态
    status: {
        type: Sequelize.STRING(10)
    },
    // 创建时间
    createTime: {
        type: Sequelize.DATE
    }
})

Order.belongsTo(Member, { as: 'member', foreignKey: 'memberId' })
Order.belongsTo(Product, { as: 'product', foreignKey: 'productId' })

module.exports = Order