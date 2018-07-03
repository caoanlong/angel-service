const redis = require('redis')
const config = require('./index')
const client = redis.createClient(config.redis)

client.select('6', (err) => {
	if (err) {
		console.log("Error " + err)
		return false
	} else {
		console.log(`redis connect at ${config.redis.port}!`)
	}
})


module.exports = client