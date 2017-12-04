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
        data: null,
        currentKey:0
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
            const show = <video src={url} controls loop />;
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
        const key=this.state.currentKey;
        this.props.addUploadFile({ name: this.state.name, progress: '待上传', data: this.state.data,key:key })
        this.props.hideModal();
        this.setState({currentKey:key+1})
    }


    render() {
        const { name, path, url, show } = this.state;
        const footer =
            <div>
                <button type='button' className='btn ant-btn' onClick={this.props.hideModal}>取消</button>
                <button type='button' disabled={(name&&path)?false:true} className='btn ant-btn ant-btn-primary' onClick={this.handleOk}>上传文件</button>
            </div>;

        return (
            <Modal title='添加素材' visible={this.props.showModal}
                onCancel={this.props.hideModal} footer={footer} okText='上传文件' maskClosable={false}>
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
                </div>
            </Modal>

        )
    }
}
