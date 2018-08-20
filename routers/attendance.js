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
    // if (ctx.headers['request_code'] == 'receive_cmd') {
    //     console.log(111)
    //     ctx.set({ 'cmd_code': 'GET_ENROLL_DATA' })
    //     ctx.body = 'success'
    //     return
    // }
    // if (ctx.headers['request_code'] == 'send_cmd_result') {
    //     console.log(ctx)
    //     ctx.body = 'success'
    //     return
    // }
    ctx.set({ 'content-type': 'application/octet-stream' })
    if (ctx.headers['request_code'] == 'realtime_enroll_data') {
        console.log(ctx.headers)
        const data = await parsePostData(ctx)
        // console.log(data)
        if (data) {
            ctx.set({ 'response_code': 'OK' })
            ctx.set({ 'trans_id': 'RTEnrollDataAction' })
        } else {
            ctx.set({ 'response_code': 'ERROR' })
        }
        ctx.body = '{"response_code":"OK"}'
        // console.log(ctx.response)
    }
    if (ctx.headers['request_code'] == 'realtime_glog') {
        const data = await parsePostData(ctx)
        // console.log(data)
        if (data) {
            ctx.set({ 'response_code': 'OK' })
        } else {
            ctx.set({ 'response_code': 'ERROR' })
        }
        ctx.body = '{"response_code":"OK"}'
        // console.log(ctx.response)
    }
    // ctx.body = 'success'
})

module.exports = router