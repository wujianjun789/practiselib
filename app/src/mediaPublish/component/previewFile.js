import React, { Component } from 'react'

import Modal from 'antd/lib/modal'
import 'antd/lib/modal/style/index.css'
import '../../../public/styles/previewFile.less'

export default class PreviewFile extends Component {
    state = {
        name: '',
        path: '',
        url: null,
        show: null,
        data: null
    }
    changeName = (e) => {
        this.setState({ name: e.target.value })
    }
    selectFile = (e) => {
        const file = e.target.files[0]
        if (!file) {
            return;
        }
        if (/^image\/.+$/.test(file.type)) {
            const url = URL.createObjectURL(file);
            const show = <img src={url} />
            this.setState({ path: file.name, url: url, show: show, data: file })
        }
        else if (/^video\/.+$/.test(file.type)) {
            const url = URL.createObjectURL(file);
            const show = <video src={url} controls autoPlay loop />;
            this.setState({ path: file.name, url: url, show: show, data: file })
        }
        else if (/^text\/plain$/.test(file.type)) {
            const self = this;
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function (e) {
                const data = this.result;
                const show = <textarea value={data} readOnly></textarea>
                self.setState({ path: file.name, url: null, show: show, data: file })
            }
        } else {
            alert('不支持该文件格式');
            return;
        }
    }
    handleOk = () => {
        console.log('上传文件');

        if (!this.state.name) {
            alert('请输入素材名称');
            return;
        }
        if (!this.state.path) {
            alert('请选择文件');
            return;
        }

        this.props.addUploadFile({ name: this.state.name, progress: 0, data: this.state.data })
        this.props.hideModal();
    }
    // uploadProgress=(e)=>{
    //     if (e.lengthComputable) {
    //         const progress = Math.round((e.loaded / e.total) * 100);
    //         this.props.addUploadFile({name:this.state.name,progress:progress})            
    //         console.log(progress);
    //     }
    // }
    // componentWillUnmount(){
    //     this.xhr.upload.removeEventListener('progress',this.uploadProgress)
    // }
    render() {
        const { name, path, url, show } = this.state;
        return (
            <Modal title='添加素材' visible={this.props.showModal}
                onOk={this.handleOk} onCancel={this.props.hideModal} okText='上传文件' maskClosable={false}>
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
                            <input type="file" accept="image/*,video/*,text/plain" onChange={this.selectFile} />
                            <span className={path ? "m-prompt m-hidden" : "m-prompt"}>请选择文件</span>
                        </div>
                    </div>
                    <div className='show'>
                        {show}
                    </div>
                    {/* <div className='material-progressWrap'>
                        <div className='material-progress' style={{ width: `${this.props.progress}%` }} />
                        <span className='progress-text' style={{left:`${this.props.progress}%`}}>{this.props.progress}%</span>
                    </div> */}
                </div>
            </Modal>

        )
    }
}
