class BaseController {
    responseSussess(data) {
        return data ? { code: 0, msg: '成功', data } : { code: 0, msg: '成功' }
    }
    responseError(err, code=-1) {
        return { code, msg: err.toString() }
    }
}

module.exports = BaseController