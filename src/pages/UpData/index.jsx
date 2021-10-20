import React,{useRef,useState} from 'react'
import axios from 'axios'
import up_data from './index.module.css'
// import *as Hint from '../../components/Hint'
import Hint from '../../components/Hint';

export default function UpData() {
  const fileChoose = useRef(null);
  // 设置地址数组
  let [fileAddress,setFileAddress] = useState([]);
  // 设置改变文件框时，改变前的文件名
  let [lastFileName,setLastFileName] = useState('');
  // 设置传输文件的文件
  // let [fileArrs,setfileArrs] = useState([]);

  // 存储input输入的file对象
  let [temporaryAddress,setTemporaryAddress] =useState([]);

  // 设置上传成功后提示框状态
  let [upDataHint,setUpDataHint] = useState(false)


  
  

  // 当文件input框改变值时，将本地地址压入数组存储起来
  const changeFile = (e) => {
    setFileAddress(()=>{
      // 变量声明
      let index1 = fileAddress.indexOf(lastFileName);
      let len = fileAddress.length;
      let value = e.target.value;
      let item=e.target.files.item(0);
      let fileItem = {};
      for (let i in item){
        fileItem[i]=item[i];
      }
      fileItem = JSON.stringify(fileItem);
      //  对已经选择的文件进行更改
      if(index1 < len && index1 !== -1){
        fileAddress[index1] = value;
        // 更改放入的file文件
       setTemporaryAddress(()=>{
          temporaryAddress[index1] = item
          return [...temporaryAddress]
        })
        localStorage.setItem("upFileAddressArr",fileAddress);
        return [...fileAddress];
      }

      // input增加文件时 对地址数组进行增加
      if(value !== '' && (fileAddress.indexOf(value) === -1)){
        fileAddress.push(value);
        // 增加file数组文件
      setTemporaryAddress(()=>{
          temporaryAddress.push(item) 
          return [...temporaryAddress]
        })
        localStorage.setItem("upFileAddressArr",fileAddress);
        return [...fileAddress];
      }
      else{
        // 选中文件重复时  抛出警告（未完成）
        console.warn("选中文件已选择过或选择文件为空，请重新选择");
        return fileAddress;
      }
    })
  }

  const changeHint = (str)=>{
    setUpDataHint(str)
  }

  // 递交文件按钮  将本地文件上传到数据库中
  const upDataBtn = () => {
    let data = new FormData() 
    let dataName = '';
    let dataAddress = ''
    for (let i in temporaryAddress){
      data.append('imgName'+i,temporaryAddress[i].name)
      data.append('img'+i,temporaryAddress[i])
      dataName = dataName + temporaryAddress[i].name + "+";
      dataAddress = dataAddress + temporaryAddress[i].path + '+';
    }
    
   
    axios({
      method: 'post',
      timeout: 2000,
      url: `http://localhost:3000/updata`,
      data: data,
    }).then(response => {
      console.log(response.data);
      setTemporaryAddress([]);
      setFileAddress([]);
      setUpDataHint(true);
      })
      .catch(error => {
      console.log(error)
      })

    axios.get('/updata',{
      params: {
      name:dataName,
      address:dataAddress,
    }}).then(response => {
      console.log(response);
    }).catch(error => {
    console.log(error)
    })
  
  }
  return (
    <div>
      {/* 循环生成所选中的文件框和input file框 */}
      {fileAddress.map((item,index) => {
        return (
          <div className={up_data.fileBox} key = {index}>
            <span className={up_data.textLocation}>{item.split("\\")[item.split("\\").length - 1 ]}
              <input type="file" accept="image/*" className={up_data.fileCheck}  onChange = {changeFile} onClick = {(e)=>{setLastFileName(item)}}/>
            </span>
          </div>
        )
      })}
      {/* 添加文件框（最后面带加号的框） */}
      <div className={[`${up_data.fileBox}`,`${up_data.active}`].join(' ')}>
        <input type="file" className={up_data.fileCheck} ref={fileChoose} onChange = {changeFile}/>
      </div>
      {/* 上传文件按钮 */}
      <button className={up_data.btn} onClick = {upDataBtn}>上传文件</button>
      <Hint upDataHint = {upDataHint} changeHint = {changeHint} text = '文件上传成功'></Hint>
    </div>
    
  )
}
