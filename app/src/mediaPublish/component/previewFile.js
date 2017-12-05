import React, { Component } from 'react'

import Modal from 'antd/lib/modal'

import { FormattedMessage, injectIntl } from 'react-intl';

import '../../../public/styles/uploadFile.less'

class PreviewFile extends Component {
    state = {
        name: '',
        path: '',
        url: null,
        show: null,
        data: null,
        currentKey: 0
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
            this.setState({ name:file.name,path: file.name, url: url, show: show, data: file })
        }
        else if (/^video\/.+$/.test(file.type)) {
            const url = URL.createObjectURL(file);
            const show = <video src={url} controls loop />;
            this.setState({ name:file.name,path: file.name, url: url, show: show, data: file })
        }
        else if (/^text\/plain$/.test(file.type)) {
            const self = this;
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function (e) {
                const data = this.result;
                const show = <textarea value={data} readOnly></textarea>
                self.setState({ name:file.name,path: file.name, url: null, show: show, data: file })
            }
        } else {
            alert('The file format is not supported');
            return;
        }
    }
    handleOk = () => {
        const key = this.state.currentKey;
        this.props.addUploadFile({ name: this.state.name, progress: this.props.intl.formatMessage({id:'mediaPublish.waiting'}), data: this.state.data, key: key })
        this.props.hideModal();
        this.setState({ currentKey: key + 1 })
    }


    render() {
        const { name, path, url, show } = this.state;
        const footer =
            <div>
                <button type='button' className='btn ant-btn' onClick={this.props.hideModal}><FormattedMessage id='button.cancel'/></button>
                <button type='button' disabled={(name && path) ? false : true} className='btn ant-btn ant-btn-primary' onClick={this.handleOk}><FormattedMessage id='mediaPublish.uploadFile'/></button>
            </div>;

        return (
            <Modal title={this.props.intl.formatMessage({id:'mediaPublish.addMaterial'})} visible={this.props.showModal}
                onCancel={this.props.hideModal} footer={footer}  maskClosable={false}>
                <div className='material'>
                    <div className='import'>
                        <span className='title-name'><FormattedMessage id='mediaPublish.importMaterial'/></span>
                        <div className='file-path'>
                            {path ? path : this.props.intl.formatMessage({id:'mediaPublish.selectFilePrompt'})}
                            <label htmlFor='select-file' className='glyphicon glyphicon-link'></label>
                            <input type="file" accept="image/*,video/*,text/plain" onChange={this.selectFile} />
                            <span className={path ? "m-prompt m-hidden" : "m-prompt"}><FormattedMessage id='mediaPublish.selectFilePath'/></span>
                        </div>
                    </div>
                    <div>
                        <span className='title-name'><FormattedMessage id='mediaPublish.materialName'/></span>
                        <input type='text' value={name} onChange={this.changeName} />
                        <span className={name ? "m-prompt m-hidden" : "m-prompt"}><FormattedMessage id='mediaPublish.inputNamePrompt'/></span>
                    </div>
                    <div className='show'>
                        {show}
                    </div>
                </div>
            </Modal>

        )
    }
}

export default injectIntl(PreviewFile)