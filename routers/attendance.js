const Router = require('koa-router')
const router = new Router()

function parsePostData( ctx ) {
    return new Promise((resolve, reject) => {
        try {
            const postdata = []
            ctx.req.addListener('data', (data) => {
                postdata.push(data)
            })
            ctx.req.addListener("end", () =>{
                const bufArr = postdata[0].toJSON().data
                const buf = Buffer.from(bufArr)
                const jsonStr = buf.toString('utf8', 4, buf.indexOf(0x00, 4))
                resolve(jsonStr)
            })
        } catch ( err ) {
            reject(err)
        }
    })
}
router.post('/', async ctx => {
    console.log(ctx.headers['request_code'])
    ctx.set({ 'content-type': 'application/octet-stream' })
    if (ctx.headers['request_code'] == 'realtime_enroll_data') {
        console.log(ctx.headers)
        const data = await parsePostData(ctx)
        console.log(data)
        if (data) {
            ctx.set({ 'response_code': 'OK' })
            ctx.set({ 'trans_id': 'RTEnrollDataAction' })        } else {
            ctx.set({ 'response_code': 'ERROR' })
        }
        // console.log(ctx.response)    }
    if (ctx.headers['request_code'] == 'realtime_glog') {
        console.log(ctx.headers)
        const data = await parsePostData(ctx)
        console.log(data)
        if (data) {
            ctx.set({ 'response_code': 'OK' })
            ctx.set({ 'trans_id': ctx.headers['trans_id'] })
        } else {
            ctx.set({ 'response_code': 'ERROR' })
        }
    }
    ctx.body = 'success'
})

module.exports = router