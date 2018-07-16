const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

const Member = require('./Member')
const LessonSet = require('./LessonSet')
const PlatformProduct = require('./PlatformProduct')

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
    // 课程ID
    lessonSetId: {
        type: Sequelize.BIGINT(32)
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
Order.belongsTo(LessonSet, { as: 'lessonSet', foreignKey: 'lessonSetId' })
Order.belongsTo(PlatformProduct, { as: 'product', foreignKey: 'productId' })

module.exports = Order