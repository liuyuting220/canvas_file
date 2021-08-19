import React from 'react'
import { useEffect, useState, useRef } from 'react';
import { ElectronicPen } from '@icon-park/react'
import './index.css'

export default function Canvaspage(props) {
    const {canvasWidth, canvasHeight} = props;
    const {canvasX = 80,canvasY = 160} = props;
    const electron = window.electron;

    const canvasRef = useRef(null);
    // let [canvasHeightWidth,setCanvasHeightWidth] = useState([]);
    let imgRef = '';
    // let [imgFile,setimgFile] = useState(''); useRef('')

    useEffect(() => {
        electron.ipcRenderer.send('canvas-start','');
        electron.ipcRenderer.on('canvas-img',(event,arg) => {
            // console.log(arg);
            // setimgFile(arg);
            imgRef = arg;
            loadImg(arg);
        })
        
    })

    const loadImg = (arg) => {
        // console.log(canvasRef);
        const elem = canvasRef.current;
        const canvas = elem.getContext('2d');

        let img = new Image();
        // console.log(imgRef);
        console.log(arg);
        img.src = "file:///C:\\Users\\max\\Desktop\\web\\canvas_file\\myImage\\"+arg;
        /* img.width = 570;
        img.height = 390; */
        // console.log(img.width,img.height);
        
        //设置canvas画布宽高  和图片宽高相同
        //  setCanvasHeightWidth([img.height,img.width]);
        

         // 加载背景图片
        img.onload = () => {
            elem.height = img.height;
            elem.width = img.width;
            // console.log(canvasX,canvasY,canvasWidth,canvasHeight);
            // console.log(img.width,img.offsetHeight);
            canvas.drawImage(img,0,0)
            // let bg = canvas.createPattern(img,"no-repeat");     //方法指定的方向内重复指定的元素
            // canvas.fillStyle = bg;  //属性设置或返回用于填充的颜色，渐变或模式
            // canvas.fillRect(canvasX,canvasY,canvasWidth,canvasHeight);    //绘制以填充矩形（左上角x，左上角y，宽，高）
        }

       
    }
    return (
        <div>
            <div>
                <canvas className="canvas_box" ref={canvasRef}></canvas>
            </div>
            <div className="draw_pencile_box">
                <ElectronicPen theme="outline" size="28" fill="#ffffff" strokeWidth={3} strokeLinecap="butt"/>
            </div>
        </div>
        
    )
}
