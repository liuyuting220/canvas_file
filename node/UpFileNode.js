var http = require('http')
var formidable = require('formidable')
var fs = require('fs')
var path = require('path')
 
var server = http.createServer(function(req, res){
  // 1 设置cors跨域
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Content-Type', 'application/json')
 
  // 2
  console.log(req.method);
  switch (req.method) {
  case 'OPTIONS':
    res.statusCode = 200
    res.end()
    break
  case 'POST':
    upload(req, res)
    break
  }
})
 
function upload(req, res) {
  // 1 判断
  if (!isFormData(req)) {
  res.statusCode = 400
  res.end('错误的请求, 请用multipart/form-data格式')
  return
  }
 
  // 2 处理
  var form = new formidable.IncomingForm()
  form.uploadDir = '../myImage'
  form.keepExtensions = true
 
  // 每当一个字段/值对已经收到时会触发该事件
  form.on('field', (field, value) => {
  console.log(field)
  console.log(value)
  })
  
  // 每当有一对字段/文件已经接收到，便会触发该事件
  form.on('file', (name, file) => {
  // 重命名文件
  let types = file.name.split('.')
  let suffix = types[types.length - 1]
  // console.log(suffix);
  fs.renameSync(file.path, path.join(form.uploadDir,`${types[0]}.${suffix}`))
  })

  // 当所有的请求已经接收到，并且所有的文件都已上传到服务器中，该事件会触发。此时可以发送请求到客户端。
  form.on('end', () => {
  res.end('上传完成!')
  })
  // 该方法会转换请求中所包含的表单数据，callback会包含所有字段域和文件信息，
  form.parse(req)
}
 
function isFormData(req) {
  let type = req.headers['content-type'] || ''
  return type.includes('multipart/form-data')
}
 
server.listen(3000)
console.log('port is on 3000.')