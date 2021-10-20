var electron = require('electron');  
const {ipcMain} = require('electron');
const path = require('path')

var app = electron.app;   //引用app
var BrowserWindow = electron.BrowserWindow;   //窗口引用
var globalShortcut = electron.globalShortcut;

var mainWindow = null;  //声明要打开的主窗口

app.on('ready',()=>{
  mainWindow = new BrowserWindow(
    {
      width:800,
      height:800,
      webPreferences:{
        nodeIntegration: true,
        enableRemoteModule: true,
        contextIsolation: false,
       },
    });


  let level = 0
  // 注册一个 'CommandOrControl+X' 的全局快捷键
  const ret = globalShortcut.register('ctrl+0', () => {
    level = 0
    mainWindow.webContents.setZoomLevel(0)
  })
  if (!ret) {
    console.log('registration failed')
  }
  // 验证是否注册成功
  console.log(globalShortcut.isRegistered('ctrl+0'))
  
  mainWindow.webContents.on('zoom-changed',(e, zoomDirection)=>{
    if (zoomDirection === 'in') {
    level = level >= 3 ? level : level += 0.2
    } else {
    level = level <= -3 ? level : level -= 0.2
    }
    mainWindow.webContents.setZoomLevel(level)
  })


  ipcMain.on('editfile',(event,arg)=>{
    const getFiles = require('./node/editFile_init');
    let arr = getFiles.getImageFiles("./myImage/");
    event.reply('editfile-reply',arr);
  })
  ipcMain.on('canvas_window',(event,arg) => {
    console.log(arg);
    var new_canvas = new BrowserWindow({
      width:1000,
      height:800,
      frame:false,
      webPreferences:{
        webSecurity:false,
        nodeIntegration:true,
        contextIsolation:false,
        enableRemoteModule:true
      },
      icon:`${__dirname}/public/favicon.ico`
    });
    new_canvas.loadURL('http://localhost:3000/canvas');
    new_canvas.on('close',()=>{
      new_canvas = null;
    })
    ipcMain.on('canvas-start',(event,arg1)=>{
      arg1=arg
      // console.log(arg);
      // event.reply('canvas-img',arg)
      event.reply('canvas-img',arg1)
    })
    
  })
  mainWindow.loadURL('http://localhost:3000/');
  // mainWindow.loadFile('./public/index.html');  //加载显示的html文件
  // mainWindow.loadFile(path.join(__dirname,'./public/index.html'))
  // 关闭窗口时将主窗口设置为null
  mainWindow.on('closed',()=>{
    mainWindow = null;
  })

})
