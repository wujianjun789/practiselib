import React,{Component} from 'react'

import '../../../public/styles/uploadNotify.less'

export default class UploadNotify extends Component{
    handleClick=(e)=>{
        e.stopPropagation();
        this.props.showUploadFile()
    }
    render(){
        return(
            <div className='upload-show' style={{display:`${this.props.showUploadNotify?'block':'none'}`}} onClick={this.handleClick}>
                <span>正在上传</span>
            </div>
        )
    }
}