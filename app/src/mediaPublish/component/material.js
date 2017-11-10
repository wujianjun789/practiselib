import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Text from './materialText'
import Image from './materialImage'
import Video from './materialVideo'

import { Modal, Tabs } from 'antd';

import '../../../public/styles/mediaPublish-modal.css'
import '../../../public/styles/material.less'


const TabPane = Tabs.TabPane;

export default class Material extends PureComponent {
    constructor(props) {
        super(props);
        this.video = undefined;
        this.state = {
            currentKey: 2
        }
    }
    handleOk = (e) => {
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
    render() {
        return (
            <div>
                <Modal title="添加素材" visible={this.props.showModal}
                    onOk={this.handleOk} onCancel={this.handleCancel}>
                    <Tabs defaultActiveKey="2" onChange={this.switchTab}>
                        <TabPane tab="文字" key="1">
                            <Text />
                        </TabPane>
                        <TabPane tab="图片" key="2">
                            <Image />
                        </TabPane>
                        <TabPane tab="视频" key="3" >
                            <Video focus={this.focus} />
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

