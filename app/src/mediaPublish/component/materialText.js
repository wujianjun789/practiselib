import React, { Component } from 'react'

export default class Text extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            path: '',
            data:'',
            width:0,
        }
        this.changeName = this.changeName.bind(this);
        this.importMaterial = this.importMaterial.bind(this);
    }

    changeName(e) {
        this.setState({ name: e.target.value })
    }

    importMaterial(e) {
        const self=this;
        const reader = new FileReader();
        const file = e.target.files[0];
        if(!file){
            return;
        }
        reader.readAsText(file);
        reader.onload=function(e){
            self.setState({path:file.name,data:this.result})
        }
        this.props.addFile('text',file);
        this.props.resetProgress(0);
    }

    render() {
        const { name, path, data } = this.state;
        return (
            <div className='material'>
                <div>
                    <span>素材名称</span>
                    <input type='text' value={name} onChange={this.changeName} />
                    <span className={name?"m-prompt m-hidden":"m-prompt"}>请输入名称</span>
                </div>
                <div className='import'>
                    <span>导入素材</span>
                    <div className='file-path'>
                        {path ? path : '选择列表文件路径'}
                        <label htmlFor='select-file' className='glyphicon glyphicon-link'></label>
                        <input type="file" accept="text/*" onChange={this.importMaterial} />
                        <span className={path?"m-prompt m-hidden":"m-prompt"}>请选择文件</span>
                    </div>
                </div>
                <div className='show'>
                    <textarea value={data}></textarea>
                </div>
                <div className='material-progressWrap'>
                    <div className='material-progress' style={{ width: `${this.props.progress}%` }} />
                    <span className='progress-text' style={{left:`${this.props.progress}%`}}>{this.props.progress}%</span>
                </div>
            </div>
        )
    }
}