const http = require('http')
const chalk = require('chalk')
const path = require('path')
const conf = require('./config/defaultConfig')
const routeConf = require('./config/routeConfig')
const server = http.createServer((req, res) => {
    const filePath = path.join(conf.root, req.url)
    try{
       routeConf(req, res, filePath)
    } catch(ex) {
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/plain')
        res.end('404 not found!')
        return
    }  
})
server.listen(conf.port, conf.hostname, () => {
	const addr = `http://${conf.hostname}:${conf.port}`
	console.log(`server started at ${chalk.green(addr)}`)
})