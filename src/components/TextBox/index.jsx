import React from 'react'
import { Redirect,Route,Switch } from 'react-router-dom'
import UpData from '../../pages/UpData'
import EditFile from '../../pages/EditFile'
import Finishing from '../../pages/Finishing'
import RecycleFile from '../../pages/RecycleFile'
import Canvaspage from '../Canvaspage'
import './index.css'

export default function TextBox(props) {
    const {mobile} = props

    return (
        <div className={["textBox",mobile?"null":"active2"].join(' ')}>
            {/* <Switch> */}
                {/* <Route path='/canvas' component={Canvaspage}></Route> */}
                <Route path='/uploading' component={UpData}></Route>
                <Route path='/edit' component={EditFile}></Route>
                <Route path='/finish' component={Finishing}></Route>
                <Route path='/recyclebin' component={RecycleFile}></Route>
                {/* <Redirect to="/uploading"/> */}
            {/* </Switch> */}
        </div>  
    )
}
