module.exports = {
	port: 3002,
	// mysql: {
    //     host: '118.89.20.215',
    //     port: 3306,
    //     user: 'root',
    //     password: 'jyw12345',
    //     database: 'angel-server'
    // },
    mysql: {
        host: '47.106.171.37',
        port: 3306,
        user: 'root',
        password: 'a1989204',
        database: 'angel_test'
    },
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