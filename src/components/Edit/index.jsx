import React from 'react'
import {NavLink} from 'react-router-dom'
import {Editor} from '@icon-park/react'
import './index.css'

export default function Edit(props) {
  const {num,setNum} = props;
  const changeBC = ()=>{
    setNum(2);
  }
  return (
    <div className = {num === 2?"bc79":" "} onClick = {changeBC}>
      <li>
          <NavLink to='/edit' >
          <Editor theme="two-tone" size="22" fill={['#D98372' ,'#FFF']} strokeWidth={3} strokeLinecap="butt"/>
          <span className = "navtext">编辑文件</span>
          </NavLink>
      </li>
    </div>
  )
}
