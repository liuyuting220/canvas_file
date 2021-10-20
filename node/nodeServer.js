var http = require('http')
var formidable = require('formidable')
var fs = require('fs')
var path = require('path')
const mysql = require("mysql");
const urlLib = require("url");
const WebSocket = require('ws');
 
var app = http.createServer(function(req, res){
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
  case 'GET':
    linkSQL(req,res)
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


var my = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "Img",
})
my.connect();

var server = require('http').Server(app)
let imgData = [];

var wss = new WebSocket.Server({port: 8080});

wss.on('connection',function connection(ws) {
    let data;
    let dataBuffer;
    let targetPath;
    ws.on('message',function incoming(message) {
        imgData = message.split('?');
        data = imgData[0].replace(/^data:image\/png;base64,/g,"");
        dataBuffer = Buffer.from(data,"base64");
        targetPath = path.resolve(__dirname,"../finishImg");
        fs.writeFile(`${targetPath}/${imgData[1]}`,dataBuffer,()=>{
          imgData.push(`${targetPath}/${imgData[1]}`);
        });
        if(imgData.length != 0){
          my.query("SELECT * FROM updataImg;", (err, data) => {
            if (err) {
              res.send({
                ok: false,
                msg: "数据库连接错误"
              });
            }
            else{
              my.query(`UPDATE updataImg SET canvasImg='${targetPath}' WHERE upname='${imgData[1]}';`)
            }
          })
        }
    })
    ws.send('完成连接并返回字符串');
})

function linkSQL(req,res){
  let urlobj = urlLib.parse(req.url);
  if(urlobj.pathname =='/updata'){
      const obj = urlLib.parse(req.url, true);
      const name = obj.query.name.split("+") ? obj.query.name.split("+"):[];
      const address = obj.query.address.split("+") ? obj.query.address.split("+"):[];
      name.pop();
      address.pop();
      my.query("SELECT * FROM updataImg;", (err, data) => {
        if (err) {
          res.end("ok: false,msg: '数据库连接错误'");
        } else {
          let len = name.length;
          for (let i in data) {
            if (name.indexOf(data[i].upname) != -1) {
              name.splice(name.indexOf(data[i].upname),1)
            }
          }
          if(name.length == 0){
            res.end("ok: false,msg: '图片全部已存在'")
          }else if(name.length != len){
            res.end("ok: false,msg: '图片部分已存在'")
          }else{
            for (let i in name) {
              let str = name[i];
              let str1 = address[i];
              my.query(`INSERT INTO updataImg(upaddress,upname) VALUES('${str1}','${str}');`,
                (err, data) => {
                  if (err) {
                    res.end("ok: false,msg: '上传失败'");
                  }
                })
            }
            console.log("upaddress写入成功");
            res.end("ok: true,msg: '上传成功'")
          }
        }
      })

    }
}


app.listen(3000, () => {
  console.log("3000端口启动");
});
 
