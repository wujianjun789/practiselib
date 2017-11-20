import React, { Component } from 'react'


export default class Video extends Component {
    constructor(props) {
        super(props);
        this.video=undefined;
        this.state = {
            name: '',
            path: '',
            url: null
        }

    }

    changeName=(e)=>{
        this.setState({ name: e.target.value })
    }

    importMaterial=(e)=> {
        const file = e.target.files[0];
        const url = URL.createObjectURL(file);
        if(url){
            this.video.controls='controls'
        }
        this.setState({ path: file.name, url: url })
        if(file){
            this.props.upload('video',file)
        }
    }
    refsCb=(node)=>{
        this.props.focus(node);
        this.video=node;
    }
    render() {
        const { name, path, url } = this.state;
        return (
            <div className='material'>
                <div>
                    <span>素材名称</span>
                    <input type='text' value={name} onChange={this.changeName} />
                    <span className={name ? "m-prompt m-hidden" : "m-prompt"}>请输入名称</span>
                </div>
                <div className='import'>
                    <span>导入素材</span>
                    <div className='file-path'>
                        {path ? path : '选择列表文件路径'}
                        <label htmlFor='select-file' className='glyphicon glyphicon-link'></label>
                        <input type="file" accept="video/*" onChange={this.importMaterial} />
                        <span className={path ? "m-prompt m-hidden" : "m-prompt"}>请选择文件</span>
                    </div>
                </div>
                <div className='show'>
                    <video src={url} ref={this.refsCb} autoPlay loop />
                </div>
            </div>
        )
    }
}