const path = require('path')
const glob = require('glob')
const Router = require('koa-router')
const axios = require('axios')
const {install} = require('@udock/plugin-mock').default

install(null, {
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

const mock = new Router()

mock
  .all('*', async (ctx) => {
    try {
      const res = await axios.get(ctx.request.path)
      ctx.status = res.status
      ctx.header = res.header
      ctx.body = res.data
    } catch (res) {
      ctx.status = res.status
      ctx.header = res.header
      ctx.body = res.data
    }
  })

module.exports = mock
