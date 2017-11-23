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
            currentKey: 2,
            data: {},
            progress: [0,0,0],
            progressShow: [false,false,false]
        }
    }
    handleOk = (e) => {
        switch (this.state.currentKey.toString()) {
            case '0':
                this.upload('text',0);
                break;
            case '1':
                this.upload('image',1);
                break;
            case '2':
                this.upload('video',2);
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
            if (key !== 3) {
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
    upload = (type,key) => {
        const data = this.state.data[type];

        if (!data) {
            console.log('未选择文件')
            return;
        }

        this.setState({progressShow:true})
        const url = 'http://192.168.155.207:3000/api/containers/common/upload';

        const form = new FormData();
        form.append('file', data);

        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
                const progress = Math.round((e.loaded / e.total) * 100);
                this.setState({
                    progress:{...this.state.progress,[key]:progress}
                })
            }
        }, false);
        xhr.addEventListener('load',()=>{
            this.setState({progressShow:false})
        },false);
        // xhr.addEventListener('error',uploadFail,false);
        // xhr.addEventListener('abort',uploadCancel,false)
        xhr.open('POST', url, true);
        xhr.send(form)
    }
    resetProgress=(key)=>{
        this.setState({
            progress:{...this.state.progress,[key]:0}
        })
    }
    render() {
        return (
            <div>
                <Modal title="添加素材" visible={this.props.showModal}
                    onOk={this.handleOk} onCancel={this.handleCancel} okText='上传'>
                    <Tabs defaultActiveKey="2" onChange={this.switchTab}>
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


