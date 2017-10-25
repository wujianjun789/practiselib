import React, { Component } from 'react';
import Select from '../../components/Select'

import '../../../public/styles/material-text.less'
export default class Text extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <div className='material-text'>
                <div><span>素材名称</span><input/></div>
                <div>
                    <span>文本内容</span><textarea />
                </div>
                <div>
                    <span>选择字体</span>
                    <Select className='font-select'/>
                </div>
                <div>
                    <span>字体颜色</span>
                    <div style={{width:'30px',height:'30px',backgroundColor:'#33e'}}></div>
                    <span>背景颜色</span>
                    <div style={{width:'30px',height:'30px',backgroundColor:'#33e'}}></div>
                </div>
            </div>
        )
    }
}