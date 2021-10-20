const express = require("express");
const mysql = require("mysql");
const urlLib = require("url");
const path = require("path");
const cors = require("cors");
const WebSocket = require('ws');
const { fstat } = require("fs");
const fs = require("fs");

var my = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "Img",
})
my.connect();

var app = express();
var server = require('http').Server(app)
let imgData = [];


var wss = new WebSocket.Server({port: 8080});

wss.on('connection',function connection(ws) {
    // console.log('connection成功');
    let data;
    let dataBuffer;
    let targetPath;
    ws.on('message',function incoming(message) {
        imgData = message.split('?');
        // console.log(imgData);
        data = imgData[0].replace(/^data:image\/png;base64,/g,"");
        dataBuffer = Buffer.from(data,"base64");
        targetPath = path.resolve(__dirname,"../finishImg");
        fs.writeFile(`${targetPath}/${imgData[1]}`,dataBuffer,()=>{
          console.log(targetPath);
        });
        imgData.push(`${targetPath}/${imgData[1]}`);
    })
    if(imgData.length != 0){
      my.query("SELECT * FROM updataImg", (err, data) => {
        if (err) {
          res.send({
            ok: false,
            msg: "数据库连接错误"
          });
        }
        else{
          my.query(`UPDATA updataImg SET canvasImg='${targetPath}' WHERE upname='${imgData[1]}'`)
          my.query("SELECT * FROM updataImg",(err,data) => {
            console.log("数据库中数据如下");
            for(let i in data){
              console.log(data[i]);
            }
          })
        }
      })
    }
    ws.send('完成连接并返回字符串');
})

app.use(cors());
app.get('/favicon.ico', function () {});
app.get('/updata', function (req, res) {
  const obj = urlLib.parse(req.url, true);
  console.log(obj.query);
  const name = obj.query.name.split("+");
  const address = obj.query.address.split("+");
  name.pop();
  address.pop();
  console.log(name[0], address[0]);
  my.query("SELECT * FROM updataImg", (err, data) => {
    if (err) {
      res.send({
        ok: false,
        msg: "数据库连接错误"
      });
    } else {
      for (let i in data) {
        if (name.index(data[i])) {
          res.send({
            ok: false,
            msg: '图片已存在'
          })
        }
      }
      for (let i in name) {
        let str = name[i];
        my.query(`INSERT INTO updataImg(upaddress,upname) VALUES('${address[i]}','${str}');`),
          (err, data) => {
            if (err) {
              res.send({
                OK: false,
                msg: "上传失败"
              });
            } else {
              console.log("upaddress写入成功");
              res.send({
                ok: true,
                msg: "上传成功"
              })
            }
          }
      }
    }
  })

  my.on('error', function (err) {
    console.log("[mysql error]", err);
  });
});

app.listen(3000, () => {
  console.log("3000端口启动");
});