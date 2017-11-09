import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Text from './materialText'
import Image from './materialImage'
import Video from './materialVideo'

import { Modal ,Tabs} from 'antd';

import '../../../public/styles/mediaPublish-modal.css'
import '../../../public/styles/material.less'


const TabPane=Tabs.TabPane;

export default class Material extends PureComponent {

    handleOk = (e) => {
        this.props.hideModal()
    }

    handleCancel = (e) => {
        this.props.hideModal()
        this.props.removeAllNotify();
    }
    switchTab=(key)=>{
        this.props.removeAllNotify();
    }
    render() {
        console.log(this.props.showModal)
        return (
            <div>
                <Modal title="添加素材" visible={this.props.showModal}
                    onOk={this.handleOk} onCancel={this.handleCancel}>
                    <Tabs  defaultActiveKey="2" onChange={this.switchTab}>
                        <TabPane tab="文字" key="1">
                            <Text addNotify={this.props.addNotify}/>
                        </TabPane>
                        <TabPane tab="图片" key="2">
                            <Image addNotify={this.props.addNotify} />
                        </TabPane>
                        <TabPane tab="视频" key="3">
                            <Video addNotify={this.props.addNotify}/>
                        </TabPane>
                    </Tabs>
                </Modal>
            </div>
        )
    }
}

Material.propTypes={
    showModal:PropTypes.bool.isRequired
}
