import React, { Component } from 'react'
import NotifyPopup from '../../common/containers/NotifyPopup'


export default class Image extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            path: '',
            url:null
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
        const url=URL.createObjectURL(file);
        this.setState({path:file.name,url:url});
    }
    render() {
        const { name, path,url } = this.state;
        return (
            <div className='material'>
                <div>
                    <span>素材名称</span>
                    <input type='text' value={name} onChange={this.changeName} />
                </div>
                <div className='import'>
                    <span>导入素材</span>
                    <div className='file-path'>
                        {path ? path : '选择列表文件路径'}
                        <label htmlFor='select-file' className='glyphicon glyphicon-link'></label>
                        <input type="file" accept="image/*" onChange={this.importMaterial} />
                    </div>
                </div>
                <div className='show'>
                    <img src={url} />
                </div>
            </div>
        )
    }
}