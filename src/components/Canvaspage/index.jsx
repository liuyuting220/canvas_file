import React from 'react'
import { useEffect, useState, useRef } from 'react';
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

export default function Canvaspage() {
    const electron = window.electron;
    let canvasIcon = true;
    // let  = false

    let [pencileBoxSta,setpencileBoxSta] = useState(false)
    const canvasRef = useRef(null);
    
    let imgRef = '';       //图片保存字符串


    useEffect(() => {
        electron.ipcRenderer.send('canvas-start','');
        electron.ipcRenderer.on('canvas-img',(event,arg) => {
            imgRef = arg;
            loadImg(arg);
        })
        
    })

    const loadImg = (arg) => {
        // console.log(canvasIcon);

        const elem = canvasRef.current;
        const canvas = elem.getContext('2d');

        let img = new Image();
        console.log(arg);
        img.src = "file:///C:\\Users\\max\\Desktop\\canvas_file\\myImage\\"+arg;
        

         // 加载背景图片
        img.onload = () => {
            elem.height = img.height;
            elem.width = img.width;
            canvas.drawImage(img,0,0)
            // let bg = canvas.createPattern(img,"no-repeat");     //方法指定的方向内重复指定的元素
            // canvas.fillStyle = bg;  //属性设置或返回用于填充的颜色，渐变或模式
            // canvas.fillRect(canvasX,canvasY,canvasWidth,canvasHeight);    //绘制以填充矩形（左上角x，左上角y，宽，高）
        }

    }
    const draw_pencile = ()=>{
        console.log("pencle");
        pencile_detail("pencle",1,"#999")
    };

    let pencile_detail = (pen,width,color) =>{
        const elem = canvasRef.current;
        const canvas = elem.getContext('2d');
        canvas.lineWidth = width;
        canvas.strokeStyle = color
        console.log("111");
        elem.onmousedown = function(ev) {
            // console.log("mousedown");
            // console.log(ev.offsetY);
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
    return (
        <div>
            <div className="draw_pencile_box">
                {/* 应用工具箱 */}
                <ApplicationTwo theme="outline" size="28" fill="#fff" strokeWidth={3} strokeLinecap="butt" onClick={() =>{let sta = !pencileBoxSta; setpencileBoxSta(sta);console.log(pencileBoxSta);}}/>
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
                        <li className="pencile_li">
                            {/* 擦除 */}
                            <Erase theme="outline" size="28" fill="#fff" strokeWidth={3} strokeLinecap="butt"/>
                        </li>
                        <li className="pencile_li">
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
                </div>
            </div>
            <div>
                <canvas className="canvas_box" ref={canvasRef}></canvas>
            </div>            
        </div>
        
    )
}
