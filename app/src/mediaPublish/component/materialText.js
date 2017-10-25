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
                <div className='left'>
                    <div><span>素材名称</span><input /></div>
                    <div className='material-content'>
                        <span>文本内容</span><textarea />
                    </div>
                    <div>
                        <span>选择字体</span>
                        <Select className='font-select' />
                    </div>
                    <div className='material-color'>
                        <span>字体颜色</span>
                        <div className='font-color'></div>
                        <span>背景颜色</span>
                        <div className='bg-color'></div>
                    </div>
                    <div className='material-bg'>
                        <span>背景透明</span>
                        <input type='checkbox'/>
                    </div>
                </div>
                <div className='right'>
                    <img/>
                </div>
            </div>
        )
    }
}