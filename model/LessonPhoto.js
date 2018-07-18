const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

const Member = require('./Member')

/* 课间剪影 */
const LessonPhoto = sequelize.define('lessonPhoto', {
    // 课间剪影ID
    lessonPhotoId: {
        type: Sequelize.BIGINT(32),
        primaryKey: true,
        allowNull: false
    },
    // 会员ID
    memberId: {
        type: Sequelize.BIGINT(32),
        allowNull: false
    },
    // 标题
    title: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    // 照片  
    photos: {
        type: Sequelize.STRING(1024),
        allowNull: false
    },
    // 创建者
    createBy: {
        type: Sequelize.BIGINT(32)
    },
    // 创建时间
    createTime: {
        type: Sequelize.DATE
    },
    // 更新者
    updateBy: {
        type: Sequelize.BIGINT(32)
    },
    // 更新时间
    updateTime: {
        type: Sequelize.DATE
    }
})

LessonPhoto.belongsTo(Member, { as: 'member', foreignKey: 'memberId' })

module.exports = LessonPhoto