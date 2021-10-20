import React,{useEffect} from 'react'
import { Route, useLocation, useHistory } from 'react-router-dom';
import edit_file from './index.module.css'

export default function EditFile() {
  // 获取url路径
  const hash = useLocation();
  const history = useHistory();
  console.log(hash);
  const electron = window.electron;
  const [data, setData] = React.useState(['111.jpg'])

  const minWindow = () => {
    // e.preventDefault()
    electron.ipcRenderer.on('editfile-reply',(event,arg) => {
      setData(arg)
      // console.log(arg);
    })
    electron.ipcRenderer.send("editfile")
  }

  useEffect(() => {
    minWindow();   
  },[])
    


  const canvas_win = (item)=>{
    console.log("成功压栈");
    // e.preventDefault()
    console.log(item);
    console.log(history.location);
    history.go('/canvas');
    console.log(history.location);
    electron.ipcRenderer.send("canvas_window",item)
  }
  return (
    <div>
      <div>
        {data.map((item,index) => {
          return (
            <div className={edit_file.fileBox} key = {item+index} onClick={() => canvas_win(item)}>
              <span className={edit_file.textLocation} key= {item}>
                {item}
              </span>
          </div>
          )
        })}
      </div>
    </div>
  )
}
