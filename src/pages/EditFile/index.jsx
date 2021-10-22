import React,{useEffect} from 'react'
import { useLocation, useHistory } from 'react-router-dom';
import edit_file from './index.module.css'

export default function EditFile() {
  // 获取url路径
  const hash = useLocation();
  const history = useHistory();
  const electron = window.electron;
  const [data, setData] = React.useState([]);
  const [state,setState] = React.useState(true);


  const minWindow = () => {
    // e.preventDefault()
    electron.ipcRenderer.on('editfile-reply',(event,arg) => {
      if(arg.length==0){
        console.log(data);
        // setData([])
        setState(false)
      }
      else{
        setData(arg)
      }

    })
    electron.ipcRenderer.send("editfile")
  }

  useEffect(() => {
    minWindow();   
  },[])
    


  const canvas_win = (item)=>{
    console.log("成功压栈");
    history.go('/canvas');
    electron.ipcRenderer.send("canvas_window",item)
  }
  return (
    <div>
      {state ? 
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
        </div>:
        <div className={state ? edit_file.photoFined:edit_file.photoUndefined}>
          还未存在上传的图片
        </div>
      }
    </div>
  )
}
