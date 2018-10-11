const fs = require('fs')
const path = require('path')
const handlebars = require('handlebars')
const promisify = require('util').promisify
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)
const tplPath = path.join(__dirname, '../template/dir.tpl')
const config = require('./defaultConfig')
const source = fs.readFileSync(tplPath, 'utf-8')
const template = handlebars.compile(source)
module.exports = async (req, res, filePath) => {
    const stats = await stat(filePath)
    if (stats.isFile()) {
        res.statusCode = 200
        res.setHeader('Cotent-Type', 'text/plain')
        fs.createReadStream(filePath).pipe(res)
    } else if (stats.isDirectory()) {
        const files = await readdir(filePath)
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/html')
        const dir = path.relative(config.root, filePath)
        const data = {
            title: path.basename(filePath),
            dir: dir ? `/${dir}` : '',
            files: files
        }
        res.end(template(data))
    }
}