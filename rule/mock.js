const path = require('path')
const glob = require('glob')
const axios = require('axios')
const {install, useProxy} = require('@udock/plugin-mock').default

install(null, {
  useProxy: true,
  load: (file) => {
    let ret
    let filePath = path.resolve('./mock', file)
    const r = new RegExp(/^(local-server|third-party)\//)
    const group = r.exec(file)
    if (group) {
      const type = group[1]
      const basePath = path.resolve('./mock', type).replace(/\\/g, '/')
      const files = glob.sync(`${basePath}/**/*.js`)
      for (const item of files) {
        let regx = item
          .replace(/\\/g, '/')
          .substr(basePath.length)
          .replace(/\.js$/, '')
          .replace(/\\/g, '/')
          .replace(/(\.|\/)/g, '\\$1')
          .replace(/\\\/_[^\\]+\\\//g, '\\/[^/]+\\/')
          // .replace(/\\\/_[^/]+$/, '\\/[^/]+')
        regx = new RegExp(`^${type}${regx}$`)
        if (regx.test(file)) {
          filePath = item
          break
        }
      }
    }
    console.log('load file: ', filePath)
    ret = require(filePath)
    setTimeout(() => {
      delete require.cache[require.resolve(filePath)]
    }, 5000)
    return ret
  }
})

function adapteResponse(res) {
  return {
    response: {
      statusCode: res.status,
      header: res.header,
      body: typeof res.data === 'string' ? res.data : JSON.stringify(res.data)
    }
  }
}

module.exports = {
  summary: 'mock rule',
  beforeSendRequest(requestDetail) {
    console.log('beforeSendRequest: ', requestDetail.url)

    return new Promise((resolve, reject) => {

      console.log('url===>>', requestDetail.url)
      console.log('requestData===>>', requestDetail.requestData + '')

      axios.request({
        url: requestDetail.url,
        method: requestDetail.requestOptions.method,
        headers: requestDetail.requestOptions.headers,
        data: requestDetail.requestData
      }).then((res) => {
        resolve(adapteResponse(res))
      }, (res) => {
        if (res === useProxy) {
          // 通过代理进行真实请求
          resolve(requestDetail)
        } else {
          resolve(adapteResponse(res))
        }
      })
    })
  }
}
