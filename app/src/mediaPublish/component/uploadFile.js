import React, { Component } from 'react'

import Modal from 'antd/lib/modal'

import '../../../public/styles/uploadFile.less'

export default class UploadFile extends Component {

    handleCancel = () => {
        this.props.hideUploadFile();
    }

    render() {
        const footer = <button type='button' className='ant-btn ant-btn-primary upload-close-btn' onClick={this.props.hideUploadFile}>关闭</button>;
        const uploadFileList = this.props.uploadFileList;
        return (
            <Modal title='上传中' visible={this.props.showUploadFile} footer={footer} maskClosable={false} onCancel={this.handleCancel}>
                <ul className='upload-file-ul'>
                    <li><span className='upload-filename upload-filename-title'>名称</span><span className='upload-progress upload-progress-title'>上传进度</span></li>
                    {uploadFileList.map((item, index) => {
                        if (item !== undefined) {
                            return (
                                <li key={index}>
                                    <span className='upload-filename'>{item.name}</span>
                                    <span className='upload-progress'>{item.progress}</span>
                                    <span className='upload-close-x' onClick={() => this.props.cancelUploadFile(index)}></span>
                                </li>)
                        }
                    })}
                </ul>
            </Modal>
        )
    }
}

