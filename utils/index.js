const crypto = require('crypto')

function minMaxBySortNumber(a, b) {
	return a.sort - b.sort
}
function sortAll(arr) {
	arr.sort(minMaxBySortNumber)
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].children && arr[i].children.length > 0) {
			sortAll(arr[i].children)
		}
	}
}

exports.menusTree = function(source) {
	let data = source.map(item => Object.assign({}, item.dataValues))
	let json = [], hash = {}
	return new Promise((resolve, reject) => {
		for (let i = 0; i < data.length; i++) {
			hash[data[i].menuId] = data[i]
		}
		let hashVP
		for (let j = 0; j < data.length; j++) {
			hashVP = hash[data[j].menuPid]
			if (hashVP) {
				if (!hashVP.children) {
					hashVP.children = []
				}
				hashVP.children.push(data[j])
			} else {  
				json.push(data[j])
			}
		}
		sortAll(json)
		resolve(json)
	})
}
exports.snowflake = require('node-snowflake').Snowflake

exports.generatePassword = (password) => {
	const key = crypto.pbkdf2Sync(password, 'xxoo_longge19890204_fuck', 1000, 32, 'sha256')
	return key.toString('hex')
}