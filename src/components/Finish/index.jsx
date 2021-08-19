import React from 'react'
import {NavLink} from 'react-router-dom'
import {DataFile} from '@icon-park/react'
import './index.css'

export default function Finish(props) {
  const {num,setNum} = props;
  const changeBC = ()=>{
      setNum(3);
  }
  return (
      <div className = {num === 3?"bc79":" "} onClick = {changeBC}>
            <li>
                <NavLink to ='finish'>
                  <DataFile theme="two-tone" size="22" fill={['#D98372' ,'#transparent']} strokeWidth={3} strokeLinecap="butt"/>
                  <span className = "navtext">完成文件</span>
                </NavLink>
            </li>
        </div>
    )
}
