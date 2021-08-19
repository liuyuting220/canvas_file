import React from 'react'
import {NavLink} from 'react-router-dom'
import {RecyclingPool} from '@icon-park/react'
import './index.css'

export default function RecycleBin(props) {
  const {num,setNum} = props;
  const changeBC = ()=>{
      setNum(4);
  }
  return (
      <div className = {num === 4?"bc79":" "} onClick = {changeBC}>
            <li>
                  <NavLink to='recyclebin'>
                    <RecyclingPool theme="two-tone" size="22" fill={['#D98372' ,'#transparent']} strokeWidth={3} strokeLinecap="butt"/>
                    <span className = "navtext">回收站</span>
                  </NavLink>
                </li>
        </div>
    )
}
