module.exports = {
	port: 3002,
	mysql: {
        host: '',
        port: 3306,
        user: 'root',
        password: '',
        database: ''
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