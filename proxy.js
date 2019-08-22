const AnyProxy = require('./lib/mini-anyproxy/proxy')
const rule = require('./rule/mock')

let proxyServer

module.exports = {
  start (opts) {
    const options = {
      port: opts.port,
      rule,
      throttle: 10000,
      forceProxyHttps: true,
      wsIntercept: true,
      silent: false
    }
    proxyServer = new AnyProxy.ProxyServer(options)

    proxyServer.on('ready', () => {

    })

    proxyServer.on('error', (e) => {

    })

    proxyServer.start()
  }
}

