import React, { Component } from 'react'
import './index.css'

export default class Hint extends Component {
    render() {
        // console.log(this.props);
        let {upDataHint,changeHint,text} = this.props
        return (
            <div>
                <div className={[upDataHint?'hint':'btnNull']}>
                    <div className={[upDataHint?'hinttext':'btnNull']}>{text}</div>
                    <button className={[upDataHint?'hintbtn':'btnNull']} onClick = {()=>changeHint(false)}>确定</button>
                </div>
            </div>
        )
    }
}
