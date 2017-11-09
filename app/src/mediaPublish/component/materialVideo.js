import React, { Component } from 'react'
import NotifyPopup from '../../common/containers/NotifyPopup'


export default class Video extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            path: '',
            data:null
        }
        this.changeName = this.changeName.bind(this);
        this.importMaterial = this.importMaterial.bind(this);
    }

    changeName(e) {
        this.setState({ name: e.target.value })
    }

    importMaterial(e) {
        const self=this;
        const { addNotify } = this.props;
        const reader = new FileReader();
        const file = e.target.files[0];
        console.log(file.type)
        if (!/^video\/\w+/.test(file.type)) {
            addNotify(0, '请选择视频');
            return false;
        }
        this.setState({path:file.name});
        reader.readAsDataURL(file);
        reader.onload=function(e){
            self.setState({data:this.result})
        }

    }
    render() {
        const { name, path } = this.state;
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
                        <input type="file" accept="video/*" onChange={this.importMaterial} />
                    </div>
                </div>
                <div className='show'>
                    <video src={this.state.data} controls/>
                </div>
                <NotifyPopup />
            </div>
        )
    }
}