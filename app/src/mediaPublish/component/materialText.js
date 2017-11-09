import React, { Component } from 'react'

export default class Text extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            path: '',
            data:''
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
        this.setState({path:file.name});
        console.log(file)
        reader.readAsText(file);
        reader.onload=function(e){
            self.setState({data:this.result})
            console.log(this.result);
        }

    }
    render() {
        const { name, path, data } = this.state;
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
                        <input type="file" accept="text/plain" onChange={this.importMaterial} />
                    </div>
                </div>
                <div className='show'>
                    <textarea value={data}></textarea>
                </div>
            </div>
        )
    }
}