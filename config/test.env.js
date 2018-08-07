module.exports = {
	port: 3002,
	mysql: {
        host: 'rm-wz9z0k2jfpf2ikzy36o.mysql.rds.aliyuncs.com',
        port: 3306,
        user: 'root',
        password: 'aA12345678',
        database: 'angel'
    },
    // mysql: {
    //     host: '47.106.171.37',
    //     port: 3306,
    //     user: 'root',
    //     password: 'a1989204',
    //     database: 'angel_test'
    // },
	redis: {
		host: '192.168.1.48',
		port: 6379,
		password: '123456'
    },
    jwtConfig: {
        'secret': 'caoanLong_xXoo_Fuck_yoU',
        'exp': { expiresIn: 60 * 60 * 24 * 365 }
    }
}