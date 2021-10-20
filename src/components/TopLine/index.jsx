import React from 'react'
import { 
  ExpandRight,
  ExpandLeft
}from '@icon-park/react'
import './index.css'

export default function TopLine(props) {
  const {mobile,setMobile} = props;
  return (
    <div>
       <div className="topLine">
        <div className = "iconBox" onClick ={()=>{setMobile(!mobile)}}>
          {/* 展开图标 */}
          {mobile?
          <ExpandRight theme="two-tone" size="26" fill={['#40405F' ,'#transparent']} strokeWidth={3} strokeLinecap="butt"/>:
          <ExpandLeft theme="two-tone" size="26" fill={['#40405F' ,'#transparent']} strokeWidth={3} strokeLinecap="butt"/>
          }
        </div>
      </div>
    </div>
  )
}
