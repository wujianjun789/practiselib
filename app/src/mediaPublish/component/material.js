import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Text from './materialText'
import Image from './materialImage'
import Video from './materialVideo'

import { Modal, Tabs } from 'antd';
// import {uploadMaterialFile} from '../../api/mediaPublish';

import '../../../public/styles/mediaPublish-modal.css'
import '../../../public/styles/material.less'


const TabPane = Tabs.TabPane;

export default class Material extends PureComponent {
    constructor(props) {
        super(props);
        this.video = undefined;
        this.state = {
            currentKey: 1,
            data: {},
            progress: [0,0,0],
        }
    }
    handleOk = (e) => {
        switch (this.state.currentKey.toString()) {
            case '0':
                this.upload('text');
                break;
            case '1':
                this.upload('image');
                break;
            case '2':
                this.upload('video');
                break;
            default:
                console.log('some errors')
                break;
        }
    }

    handleCancel = (e) => {
        this.props.hideModal()
    }
    switchTab = (key) => {
        if (this.video !== undefined && this.video.src) {
            if (key !== 2) {
                this.video.pause();
            }
        }
        this.setState({ currentKey: key })
    }
    focus = (node) => {
        this.video = node
    }
    addFile = (type, file) => {
        this.setState({ data: { ...this.state.data, [type]: file } })
    }
    upload = (type) => {
        const data = this.state.data[type];

        if (!data) {
            console.log('未选择文件')
            return;
        }

        const url = 'http://192.168.155.207:3000/api/containers/common/upload';

        const form = new FormData();
        form.append('file', data);

        const xhr = new XMLHttpRequest();
        this.xhr=xhr
        xhr.upload.addEventListener('progress', this.uploadProgress);


        // xhr.addEventListener('load',()=>{
        //     this.setState({progressShow:false})
        // },false);
        // xhr.addEventListener('error',uploadFail,false);
        // xhr.addEventListener('abort',uploadCancel,false)
        xhr.open('POST', url, true);
        xhr.send(form)
        console.log(xhr);
        console.log(this.xhr)
        console.log(Object.is(xhr,this.xhr))
    }
    uploadProgress=(e)=>{
        if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            this.setState({
                progress:{...this.state.progress,[this.state.currentKey]:progress}
            })
        }
    }
    resetProgress=(key)=>{
        this.setState({
            progress:{...this.state.progress,[key]:0}
        })
    }
    componentWillUnmount(){
        this.xhr.upload.removeEventListener('progress',this.uploadProgress);
        // this.xhr.removeEventListener('load',)
    }
    render() {
        return (
            <div>
                <Modal title="添加素材" visible={this.props.showModal}
                    onOk={this.handleOk} onCancel={this.handleCancel} okText='上传'>
                    <Tabs defaultActiveKey="1" onChange={this.switchTab}>
                        <TabPane tab="文字" key="0">
                            <Text addFile={this.addFile} progress={this.state.progress[0]} resetProgress={this.resetProgress}/>
                        </TabPane>
                        <TabPane tab="图片" key="1" >
                            <Image addFile={this.addFile} progress={this.state.progress[1]} resetProgress={this.resetProgress}/>
                        </TabPane>
                        <TabPane tab="视频" key="2" >
                            <Video focus={this.focus} addFile={this.addFile} progress={this.state.progress[2]} resetProgress={this.resetProgress}/>
                        </TabPane>
                    </Tabs>
                </Modal>
            </div>
        )
    }
}


