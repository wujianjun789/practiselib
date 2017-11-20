import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Text from './materialText'
import Image from './materialImage'
import Video from './materialVideo'

import { Modal, Tabs } from 'antd';
import {uploadMaterialFile} from '../../api/mediaPublish';

import '../../../public/styles/mediaPublish-modal.css'
import '../../../public/styles/material.less'


const TabPane = Tabs.TabPane;

export default class Material extends PureComponent {
    constructor(props) {
        super(props);
        this.video = undefined;
        this.state = {
            currentKey: 2,
            data: {}
        }
    }
    handleOk = (e) => {
        console.log(this.state.currentKey)
        switch (this.state.currentKey.toString()) {
            case '1':
                this.upload('text');
                break;
            case '2':
                this.upload('image');
                break;
            case '3':
                this.upload('video');
                break;
            default:
                console.log('some errors')
                break;
        }
        this.props.hideModal()
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
        console.log(this.state.data)
    }
    upload = (type) => {
        const data=this.state.data[type];
    
        if(!data){
            console.log('未选择文件')
            return;
        }

        uploadMaterialFile(type,data)

        


    }
    componentDidUpdate() {
        console.log(this.state.data)
    }
    render() {
        return (
            <div>
                <Modal title="添加素材" visible={this.props.showModal}
                    onOk={this.handleOk} onCancel={this.handleCancel}>
                    <Tabs defaultActiveKey="2" onChange={this.switchTab}>
                        <TabPane tab="文字" key="1">
                            <Text upload={this.addFile} />
                        </TabPane>
                        <TabPane tab="图片" key="2" >
                            <Image upload={this.addFile} />
                        </TabPane>
                        <TabPane tab="视频" key="3" >
                            <Video focus={this.focus} upload={this.addFile} />
                        </TabPane>
                    </Tabs>
                </Modal>
            </div>
        )
    }
}
Material.propTypes = {
    showModal: PropTypes.bool.isRequired
}

