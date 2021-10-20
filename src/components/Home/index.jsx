import React,{useState} from 'react'
import './index.css'

import TopLine from '../TopLine'
import UpLoading from '../UpLoading'
import Edit from '../Edit'
import Finish from '../Finish'
import RecycleBin from '../RecycleBin'
import TextBox from '../TextBox'

export default function Home() {
  let [mobile,setMobile] = useState(true);
  let [num,setNum] = useState(1);
  return (
    <div>
      <div className={["navBox",mobile?"null":"active"].join(' ')}>
        <div>
          <span></span>
          <input type="text"/>
        </div>
        <ul>
          <UpLoading num = {num} setNum = {setNum}></UpLoading>
          <Edit num = {num} setNum = {setNum}></Edit>
          <Finish num = {num} setNum = {setNum}></Finish>
          <RecycleBin num = {num} setNum = {setNum}></RecycleBin>
        </ul>
      </div>
      <div className={["textBody",mobile?"null":"active1"].join(' ')}>
        <TopLine setMobile = {setMobile} mobile = {mobile}></TopLine>
        <TextBox setMobile = {setMobile} mobile = {mobile}></TextBox>
      </div>
    </div>
  )
}
