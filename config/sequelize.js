const { mysql } = require('./index')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const operatorsAliases = {
	$eq: Op.eq,
	$ne: Op.ne,
	$gte: Op.gte,
	$gt: Op.gt,
	$lte: Op.lte,
	$lt: Op.lt,
	$not: Op.not,
	$in: Op.in,
	$notIn: Op.notIn,
	$is: Op.is,
	$like: Op.like,
	$notLike: Op.notLike,
	$iLike: Op.iLike,
	$notILike: Op.notILike,
	$regexp: Op.regexp,
	$notRegexp: Op.notRegexp,
	$iRegexp: Op.iRegexp,
	$notIRegexp: Op.notIRegexp,
	$between: Op.between,
	$notBetween: Op.notBetween,
	$overlap: Op.overlap,
	$contains: Op.contains,
	$contained: Op.contained,
	$adjacent: Op.adjacent,
	$strictLeft: Op.strictLeft,
	$strictRight: Op.strictRight,
	$noExtendRight: Op.noExtendRight,
	$noExtendLeft: Op.noExtendLeft,
	$and: Op.and,
	$or: Op.or,
	$any: Op.any,
	$all: Op.all,
	$values: Op.values,
	$col: Op.col
}

const sequelize = new Sequelize(mysql.database, mysql.user, mysql.password, {
	host: mysql.host,
	port: mysql.port,
	dialect: 'mysql',
	pool: {
		idle: 30000,
		min: 20,
		max: 30
	},
	define: {
		engine: 'innodb',
		freezeTableName: true, // 使用define中的名字
		timestamps: false, // 取消字段updateAt,createAt
	},
	// operatorsAliases: false,
	timezone: '+08:00',
	logging: false,
	operatorsAliases
})

// sequelize.sync({force: true})
sequelize.sync()

console.log('mysql connect success at ' + mysql.port + '!!!')

module.exports = sequelize