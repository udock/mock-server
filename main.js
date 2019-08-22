const proxy = require('./proxy')

const options = {
  addr: '0.0.0.0',
  proxyProt: process.argv[2] || 7777
}

proxy.start({ port: options.proxyProt })
