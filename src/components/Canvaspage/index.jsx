import React, { Component } from 'react'
import { useEffect, useState, useRef } from 'react';
import { SketchPicker } from 'react-color'
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
        let height = canvas.measureText('M').width;
        return height/6+height;
    }
    // 得到字符宽度函数
    getWidth (canvas) {
        let height = canvas.measureText(this.text).width;
        return height/6+height;
    }
    // 插入字符串
    addstring (text) {
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

        canvas.strokeText(this.text,this.left,this.bottom);
        canvas.fillText(this.text,this.left,this.bottom);

        canvas.restore();
    }
    //擦除文本：注意根据canvas规范要想擦除文本，必须替换掉整个Canvas
    erase (canvas,imageData) {
        canvas.putImageData(imageData,0,0);
    }
}


export default function Canvaspage() {
    const electron = window.electron;
    let canvasIcon = true;
    let colorInput = '#ffffff';       // 记录颜色拾取器的颜色

    // 应用工具箱的按钮状态
    const [pencileBoxSta,setpencileBoxSta] = useState(false)
    const [pencileWidth,setPencileWidth] = useState(1)
    const canvasRef = useRef(null);
    const imgRef = useRef(null)
    const inputRef = useRef(null);
    const inputTextRef = useRef(null);
    
    // let imgRef = '';       //图片保存字符串
    
    let cursor = new TextInput();    // 光标对象
    let line = null;                  // 新文本对象
    let blinkingInterval = null;      // 光标闪烁定时器

    let blink_time = 1000;
    let blink_off = 300;

    useEffect(() => {
        // changeInputNum();
        // inputTextRef.current = inputRef.current.value
        electron.ipcRenderer.send('canvas-start','');
        // 接收参数 接收文件夹中的图片；列表
        electron.ipcRenderer.on('canvas-img',(event,arg) => {
            // imgRef = arg;
            loadImg(arg);
        })
    }, [])
    // 初始化canvas画布及图片背景
    const loadImg = (arg) => {
        const elem = canvasRef.current;
        const canvas = elem.getContext('2d');

        imgRef.current.src = "file:///C:\\Users\\max\\Desktop\\canvas_file\\myImage\\"+arg;
        let img = new Image();
        console.log(arg);
        img.src = "file:///C:\\Users\\max\\Desktop\\canvas_file\\myImage\\"+arg;
        

         // 加载背景图片
        img.onload = () => {
            elem.height = img.height;
            elem.width = img.width;
            // canvas.drawImage(img,0,0)
            // let bg = canvas.createPattern(img,"no-repeat");     //方法指定的方向内重复指定的元素
            // canvas.fillStyle = bg;  //属性设置或返回用于填充的颜色，渐变或模式
            // canvas.fillRect(canvasX,canvasY,canvasWidth,canvasHeight);    //绘制以填充矩形（左上角x，左上角y，宽，高）
        }

    }



    // 画笔点击
    const draw_pencile = () => {
        // console.log("pencle");
        pencile_detail("pencle",pencileWidth,colorInput)
    };

    // 橡皮点击
    const eraser = () => {
        // console.log("eraser");
        pencile_detail("eraser",pencileWidth)
    }

    // 文本框建立
    const buildTextBox = () => {
        // console.log(colorInput);
    }

    // 改变画笔宽度数据
    const changeInputNum = () => {
        setPencileWidth(inputRef.current.value)
        inputTextRef.current.innerHTML = inputRef.current.value
        // draw_pencile(pencileWidth);
    }
    // 颜色拾取器的颜色改变
    const changeColorBox = (color) => {
        console.log('color',color);
        colorInput = color;
    }

    // 绘画路径
    let pencile_detail = (pen,width,color) =>{
        const elem = canvasRef.current;
        const canvas = elem.getContext('2d');
        // canvas.lineWidth = width;
        // canvas.strokeStyle = color
        // console.log("111");
        if(pen=="pencle"){
            elem.onmousedown = function(ev) {
                canvas.beginPath()
                canvas.lineWidth = width;
                canvas.strokeStyle = color
                var ev = ev || window.event;
                let offX = ev.offsetX;
                let offY = ev.offsetY;
                // canvas.moveTo(ev.clientX,ev.clientY)
                canvas.moveTo(offX,offY)
                // canvas.moveTo(ev.clientX - elem.offsetLeft + elem.scrollLeft, ev.clientY - elem.offsetTop + elem.scrollTop); //ev.clientX-oC.offsetLeft,ev.clientY-oC.offsetTop鼠标在当前画布上X,Y坐标
                document.onmousemove = function(ev) {
                    var ev = ev || window.event; //获取event对象
                    // canvas.lineTo(ev.clientX,ev.clientY)
                    let offX = ev.offsetX;
                    let offY = ev.offsetY;
                    canvas.lineTo(offX,offY)
                    // canvas.lineTo(ev.clientX - elem.offsetLeft + elem.scrollLeft, ev.clientY - elem.offsetTop + elem.scrollTop);
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
    return (
        <div>
            <div className="draw_pencile_box">
                {/* 应用工具箱 */}
                <ApplicationTwo theme="two-tone" size="30" fill={['#40605F' ,'#C2CFCF']} strokeWidth={3} strokeLinecap="butt" onClick={() =>{
                    setpencileBoxSta(!pencileBoxSta);
                    // canvasWH()
                    }}/>
                {/* <ApplicationTwo theme="outline" size="28" fill="#fff" strokeWidth={3} strokeLinecap="butt"/> */}
                <div className={["pencile_wrap",pencileBoxSta?"pencile_wrap_time":"pencile_wrap_leave"].join(" ")}>
                    <ul className="pencile_ul">
                        <li className="pencile_li" onClick={draw_pencile}>
                            {/* 画笔 */}
                            <ElectronicPen theme="outline" size="28" fill="#ffffff" strokeWidth={3} strokeLinecap="butt" />
                        </li>
                        <li className="pencile_li">
                            {/* 填充背景颜色 */}
                            <BackgroundColor theme="outline" size="28" fill="#fff" strokeWidth={3} strokeLinecap="butt"/>
                        </li>
                        <li className="pencile_li" onClick={eraser}>
                            {/* 擦除 */}
                            <Erase theme="outline" size="28" fill="#fff" strokeWidth={3} strokeLinecap="butt"/>
                        </li>
                        <li className="pencile_li" onClick = { buildTextBox }>
                            {/* 文字 */}
                            <AddTextTwo theme="outline" size="28" fill="#fff" strokeWidth={3} strokeLinecap="butt"/>
                        </li>
                        <li className="pencile_li">
                            {/* 画笔大小 */}
                            <Dot theme="outline" size="28" fill="#fff" strokeWidth={3} strokeLinecap="butt"/>
                        </li>
                        <li className="pencile_li">
                            {/* rgb */}
                            <Platte theme="outline" size="28" fill="#fff" strokeWidth={3} strokeLinecap="butt"/>
                        </li>
                    </ul>
                    <div className='textbox'>
                        <label>文本大小</label>
                        <select>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                            <option value="14">14</option>
                            <option value="16">16</option>
                            <option value="18">18</option>
                            <option value="20">20</option>
                        </select>
                    </div>
                    <div className="inputbox">
                        <span ref = {inputTextRef}>{inputRef.current?.value}</span>
                        <input type="range" min="1" max="30" value={ pencileWidth } step="1" ref={inputRef} onChange={()=>changeInputNum()}></input>
                    </div>
                    <div className="colorbox">
                        <ColorPicker changeColorBox={changeColorBox}/>
                    </div>
                </div>
            </div>
            <div>
                <img className="background-img" ref = {imgRef}></img>
                <canvas className="canvas_box" ref={canvasRef}></canvas>
            </div>            
        </div>
        
    )
}
