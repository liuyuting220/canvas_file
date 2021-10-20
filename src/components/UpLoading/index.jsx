import React from 'react'
import { NavLink } from 'react-router-dom'
import { InboxOut } from '@icon-park/react'
import './index.css'

export default function UpLoading(props) {
  const {num,setNum} = props;
  const changeBC = ()=>{
    setNum(1);
  }
  return (
    <div className = {num === 1?"bc79":" "} onClick = {changeBC}>
      <li>
        <NavLink to='uploading'>
          <InboxOut theme="two-tone" size="22" fill={['#D98372' ,'#transparent']} strokeWidth={3} strokeLinecap="butt"/>
          <span className = "navtext">上传文件</span>
        </NavLink> 
      </li>
    </div>
  )
}
