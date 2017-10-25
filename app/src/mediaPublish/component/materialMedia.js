import React,{Component} from 'react'
import '../../../public/styles/material-media.less'

export default class Media extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className='material-media'>
                <div>
                    <span>素材名称</span>
                    <input/>
                </div>
                <div className='media-file'>
                    <span>导入素材</span>
                    <input type="file"/>
                </div>
                <div>
                    <img/>
                </div>
            </div>
        )
    }
}