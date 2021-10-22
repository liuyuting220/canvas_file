import React, { Component } from 'react'
import { useEffect, useState, useRef } from 'react';
// import Websocket from 'ws'
import { SketchPicker } from 'react-color'
import { createWebSocket,closeWebSocket } from '../WebSocket';
import {
  ApplicationTwo,
  ElectronicPen,
  BackgroundColor,
  Erase,
  AddTextTwo,
  Dot,
  Platte
 } from '@icon-park/react'
import './index.css'

// 颜色拾取器组件
const ColorPicker = (props) => {
  const [color, setColor] = useState('#fff')
  const onChangeColor = (colorObj) => {
    setColor(colorObj.hex)
    props.changeColorBox(colorObj.hex)
  }
  return <SketchPicker color={color} onChange={onChangeColor} /> 
}

// 鼠标对象
class TextCursor {
  constructor(width,fillStyle){
    this.width = width || 2;
    this.fillStyle = fillStyle || 'rgba(0,0,0,0.5)';
    this.left = 0;
    this.top = 0;
  }
  

  getHeight(canvas){
    return canvas.fontSize;
  }
  //创建光标所在路径
  creatPath(canvas){
    canvas.beginPath();
    canvas.rect(this.left,this.top,this.width,this.getHeight(canvas));
  }
  //绘制光标 left,bottom代表鼠标点下的一点在canvas中的坐标，即loc.x,loc.y
  draw(canvas,left,bottom){
    canvas.save();

    this.left = left;
    this.top = bottom - this.getHeight(canvas);
    this.creatPath(canvas);

    canvas.fillStyle = this.fillStyle;
    canvas.fill();

    canvas.restore();
  }
  //擦除光标:擦除的是光标所在的那一块像素
  erase(canvas,imageData){
    canvas.putImageData(imageData,0,0,this.left,this.top,this.width,this.getHeight(canvas));
  }
}

  


// 文本类  每次点击创建的类
class TextInput{
  constructor(x,y){
    this.left = x;
    this.bottom = y;
    this.text = '';  //插入文本
    this.caret = 0;   //插入字符位置数
  }
  // 得到字符高度函数
  getHeight (canvas) {
    return canvas.fontSize;
  }
  // 得到字符宽度函数
  getWidth (canvas) {
    return canvas.fontSize;
  }
  // 插入字符串
  addString (text) {
    this.text = this.text.substr(0,this.caret) + text + this.text.substr(this.caret);
    // 增加字符串位数
    this.caret += text.length
  }
  //删除字符
  removeCharacterBeforeCaret () {
    if(this.caret===0){
      return;
    }
    //得到新的字符串
    this.text = this.text.substr(0,this.caret-1)+this.text.substr(this.caret);
    //更新新字符串位数
    this.caret--;
  }
  //重绘更新后的文本
  draw (canvas) {
    canvas.save();

    canvas.textAlign = 'start';
    canvas.textBaseline = 'bottom';

    canvas.font = canvas.fontSize + "px " + "sans-serif";
    canvas.strokeText(this.text,this.left,this.bottom);
    canvas.fillText(this.text,this.left,this.bottom);

    canvas.restore();
  }
  //擦除文本：注意根据canvas规范要想擦除文本，必须替换掉整个Canvas
  erase (canvas,imageData) {
    canvas.putImageData(imageData,0,0);
  }
}

export default function CanvasPage() {
  const electron = window.electron;
  let colorInput = '#ffffff';     // 记录颜色拾取器的颜色
  let type = 'jpg';         // canvas保存图片类型

  // 应用工具箱的按钮状态
  const [pencilBoxSta,setPencilBoxSta] = useState(false)
  const [pencilWidth,setPencilWidth] = useState(1)
  const canvasRef = useRef(null);
  const imgRef = useRef(null)
  const inputRef = useRef(null);
  const inputTextRef = useRef(null);
  const sizeRef = useRef(null)
  


  useEffect(() => {
    electron.ipcRenderer.send('canvas-start','');
    // 接收参数 接收文件夹中的图片；列表
    electron.ipcRenderer.on('canvas-img',(event,arg) => {
      // imgRef = arg;
      console.log(arg);
      loadImg(arg);
    })
  }, [])
  // 初始化canvas画布及图片背景
  const loadImg = (arg) => {
    const elem = canvasRef.current;
    const canvas = elem.getContext('2d');

    imgRef.current.src = "file:///C:\\Users\\max\\Desktop\\canvas_file\\myImage\\"+arg;
    let img = new Image();
    img.src = "file:///C:\\Users\\max\\Desktop\\canvas_file\\myImage\\"+arg;
    

     // 加载背景图片
    img.onload = () => {
      elem.height = img.height;
      elem.width = img.width;
    }

  }



  // 画笔点击
  const draw_pencil = () => {
    pencil_detail("pencil",pencilWidth,colorInput)
  };

  // 橡皮点击
  const eraser = () => {
    pencil_detail("eraser",pencilWidth)
  }

  // 文本框建立
  const buildTextBox = () => {
    const elem = canvasRef.current;
    const canvas = elem.getContext('2d');

    var cursor = new TextCursor()     // 光标对象
    var line = null;           // 文本对象
    var cursorInterval = null;       // 闪烁定时器
    var drawingSurfaceImageDate;     // 保存画布数据

    const blink_time = 1000;       // 光标闪烁时间间隔
    const blink_off = 300;   
    
    cursor.fillStyle = colorInput;
    
    canvas.fillStyle = colorInput
    canvas.strokeStyle = colorInput;
    canvas.lineWidth = 2;

    // 画布数据初始化
    setFont(sizeRef.current.value);
    saveDrawingSurface();

     // canvas点击事件
     elem.onmousedown = function(e){
      var loc = windowToCanvas(e.clientX,e.clientY);
      moveCursor(loc.x,loc.y);
      // 每次点击时新建一个文本行对象
      line = new TextInput(loc.x,loc.y); 
    }

    // 键盘输入事件
    // onkeypress只有输入键可触发，晚于onkeydown触发
    document.onkeypress = function(e){
      // e有一个属性e.which指示哪个键被按下，给出该键的索引值（按键码）
      // 静态函数String.fromCharCode()可以把索引值（按键码）转化成该键对应的的字符
      var key = String.fromCharCode(e.which);
        canvas.save();
        // 为擦除文本清空整个canvas,也保留了上次写的文本
        line.erase(canvas,drawingSurfaceImageDate);
        // 插入文本内容到当前文本行对象
        line.addString(key);
        // 定义新的光标位位置于文本行最后
        moveCursor(line.left+line.getWidth(canvas),line.bottom);

        // 重绘出新的文本行
        line.draw(canvas);
        canvas.restore();

    }

    // 键盘删除事件

    document.onkeydown = function(e){
      // 因为调用e.preventDefault()会禁用后后的onkeypress事件，因为功能键backspace和enter,不需要执行keypress,所以要禁用掉
      if(e.key === 'Backspace' || e.key === 'Page Down'){
        e.preventDefault();
      }

      // 按下为Backspace键时执行删除文本最后位的字符操作
      if(e.key === 'Backspace'){
        canvas.save();
        // 清空本行文本行
        line.erase(canvas,drawingSurfaceImageDate);
        //删除上一个字符
        line.removeCharacterBeforeCaret();
        // 重新定位光标位置
        moveCursor(line.left+line.getWidth(canvas),line.bottom);

        // 重绘新的文本行
        line.draw(canvas);

        canvas.restore();
      }
    }


    // 产生光标
    function moveCursor(x,y){
      // 擦除上一次光标位置
      cursor.erase(canvas,drawingSurfaceImageDate);
      // 每次保存的是上一次之前 所有文本行的canvas画布的像素
      saveDrawingSurface();
      cursor.draw(canvas,x,y);
      blinkCursor(x,y);
    }
    // 光标闪烁
    function blinkCursor(x,y){
      clearInterval(cursorInterval);
      cursorInterval = setInterval(function(){
        cursor.erase(canvas,drawingSurfaceImageDate);
        setTimeout(function(){
          // 避免上次光标的此定时器启动没停掉，只执行当前光标的些事件
          if(cursor.left == x&&cursor.top+cursor.getHeight(canvas) == y){ 
            cursor.draw(canvas,x,y);
          }
        },blink_off);
      },blink_time);
    }

    // Failed to execute 'putImageData' on 'CanvasRenderingContext2D': Value is not of type 'long'.

    
    // 设置字体
    function setFont(value){
      canvas.fontSize=value;
      canvas.font = value;
    }

    // 保存画布数据
    function saveDrawingSurface(){
      drawingSurfaceImageDate = canvas.getImageData(0,0,elem.width,elem.height);
    }

    // 转换坐标
    function windowToCanvas(x,y){
      var bbox = elem.getBoundingClientRect();
      return {
        x:x-bbox.left*(elem.width/bbox.width),
        y:y-bbox.top*(elem.height/bbox.height)
      };
    };
  }

  // 改变画笔宽度数据
  const changeInputNum = () => {
    setPencilWidth(inputRef.current.value)
    inputTextRef.current.innerHTML = inputRef.current.value
    // draw_pencil(pencilWidth);
  }
  // 颜色拾取器的颜色改变
  const changeColorBox = (color) => {
    colorInput = color;
  }

  // 绘画路径
  let pencil_detail = (pen,width,color) =>{
    const elem = canvasRef.current;
    const canvas = elem.getContext('2d');
    if(pen=="pencil"){
      elem.onmousedown = function(ev) {
        canvas.beginPath()
        canvas.lineWidth = width;
        canvas.strokeStyle = color
        var ev = ev || window.event;
        let offX = ev.offsetX;
        let offY = ev.offsetY;
        canvas.moveTo(offX,offY)
        document.onmousemove = function(ev) {
          var ev = ev || window.event; //获取event对象
          let offX = ev.offsetX;
          let offY = ev.offsetY;
          canvas.lineTo(offX,offY)
          canvas.stroke();
        };
        elem.onmouseup = function() {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      };
    }
    else{
      elem.onmousedown = function(ev){
        var ev = ev || window.event;
        let offX = ev.offsetX;
        let offY = ev.offsetY;
        canvas.save();
        canvas.beginPath();
        canvas.arc(offX,offY,width/2,0,Math.PI*2);
        canvas.clip();
        canvas.clearRect(offX-width/2,offY-width/2,width,width)
        canvas.restore();
        document.onmousemove = function(ev) {
          var ev = ev || window.event; 
          let offX = ev.offsetX;
          let offY = ev.offsetY;
          canvas.save();
          canvas.beginPath();
          canvas.arc(offX,offY,width/2,0,Math.PI*2);
          canvas.clip();
          canvas.clearRect(offX-width/2,offY-width/2,width,width)
          canvas.restore();
        };
        elem.onmouseup = function() {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      }
    }
  }

  // 保存绘制的canvas画板
  const saveCanvas = () => {
    const elem = canvasRef.current;
    const canvas = elem.getContext('2d');
    let imgData = elem.toDataURL(type);
    // 加工image data，替换mime type
    imgData = imgData.replace(_fixType(type),'image/octet-stream');
    // 下载后的问题名
    let name = imgRef.current.src;
    let filename = name.split("/")[name.split("/").length - 1];
    // download
    console.log("开始创建WebSocket连接");
    createWebSocket(imgData,filename);
    
  }

  // 将mime-type改为image/octet-stream，强制让浏览器直接download
  const _fixType = function(type) {
    type = type.toLowerCase().replace(/jpg/i, 'jpeg');
    let r = type.match(/png|jpeg|bmp|gif/)[0];
    return 'image/' + r;
  };
     
  
  return (
    <div>
      <div className="draw_pencil_box">
        {/* 应用工具箱 */}
        <ApplicationTwo theme="two-tone" size="30" fill={['#40605F' ,'#C2CFCF']} strokeWidth={3} strokeLinecap="butt" onClick={() =>{
          setPencilBoxSta(!pencilBoxSta);
          // canvasWH()
          }}/>
        <div className={["pencil_wrap",pencilBoxSta?"pencil_wrap_time":"pencil_wrap_leave"].join(" ")}>
          <ul className="pencil_ul">
            <li className="pencil_li" onClick={draw_pencil}>
              {/* 画笔 */}
              <ElectronicPen theme="outline" size="28" fill="#ffffff" strokeWidth={3} strokeLinecap="butt" />
            </li>
            <li className="pencil_li">
              {/* 填充背景颜色 */}
              <BackgroundColor theme="outline" size="28" fill="#fff" strokeWidth={3} strokeLinecap="butt"/>
            </li>
            <li className="pencil_li" onClick={eraser}>
              {/* 擦除 */}
              <Erase theme="outline" size="28" fill="#fff" strokeWidth={3} strokeLinecap="butt"/>
            </li>
            <li className="pencil_li" onClick = { buildTextBox }>
              {/* 文字 */}
              <AddTextTwo theme="outline" size="28" fill="#fff" strokeWidth={3} strokeLinecap="butt"/>
            </li>
            <li className="pencil_li">
              {/* 画笔大小 */}
              <Dot theme="outline" size="28" fill="#fff" strokeWidth={3} strokeLinecap="butt"/>
            </li>
            <li className="pencil_li">
              {/* rgb */}
              <Platte theme="outline" size="28" fill="#fff" strokeWidth={3} strokeLinecap="butt"/>
            </li>
          </ul>
          <div className='text_box'>
            <label>文本大小</label>
            <select ref = { sizeRef }> 
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>
              <option value="60">60</option>
              <option value="70">70</option>
              <option value="80">80</option>
            </select>
          </div>
          <div className="input_box">
            <span ref = {inputTextRef}>{inputRef.current?.value}</span>
            <input type="range" min="1" max="30" value={ pencilWidth } step="1" ref={inputRef} onChange={()=>changeInputNum()}></input>
          </div>
          <div className="color_box">
            <ColorPicker changeColorBox={changeColorBox}/>
          </div>
        </div>
      </div>
      <div>
        <img className="background_img" ref = {imgRef}></img>
        <canvas className="canvas_box" ref={canvasRef}></canvas>
      </div>   
      <div onClick={saveCanvas}>
        <button className="save_canvas">保存</button>
      </div>     
    </div>
    
  )
}
