const http = require('http');
const axios = require('axios')

const proxy = http.createServer((request, response) => {
  axios({
    url: request.url,
    method: request.method,
    headers: request.headers,
    data: request.data
  }).then((res) => {
    response.writeHead(res.status, res.headers)
    response.end(JSON.stringify(res.data || ''))
  }, (res) => {
    response.writeHead(res.status || 404, res.headers || {})
    response.end(JSON.stringify(res.data || ''))
  }).catch((res) => {
    response.writeHead(res.status || 500, res.headers || {})
    response.end(JSON.stringify(res.data || ''))
  })
})

module.exports = {
  start (options = {}) {
    options = {
      addr: '0.0.0.0',
      port: 7777,
      ...options
    }
    proxy.listen(options.port, options.addr)
    console.log(`mock proxy server on ${options.addr}:${options.port}`)
  }
}
