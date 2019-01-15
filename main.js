const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const app = new Koa()
const server = require('http').createServer(app.callback())
const mock = require('./routes/mock')
const proxy = require('./proxy')

app.use(bodyParser())

let router = new Router()
router.use('/', mock.routes(), mock.allowedMethods())

app
  .use(router.routes())
  .use(router.allowedMethods())

const options = {
  addr: '0.0.0.0',
  port: process.argv[2] || 8022,
  proxyProt: process.argv[3] || 7777
}

server.listen(options.port, options.addr)
console.log(`mock server on ${options.addr}:${options.port}`)

proxy.start({ port: options.proxyProt })
