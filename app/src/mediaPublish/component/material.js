import React, { Component } from 'react'
import Text from './materialText'
import Media from './materialMedia'

import { Modal ,Tabs} from 'antd';

import '../../../public/styles/mediaPublish-modal.css'
// import 'antd/lib/style/index.css'

const TabPane=Tabs.TabPane;

export default class Material extends Component {
    
    handleOk = (e) => {
        this.props.hideModal()
    }

    handleCancel = (e) => {
        this.props.hideModal()
    }
    render() {
        return (
            <div>
                <Modal title="添加素材" visible={this.props.showModal}
                    onOk={this.handleOk} onCancel={this.handleCancel}>
                    <Tabs  defaultActiveKey="1">
                        <TabPane tab="文字" key="1">
                        </TabPane>
                        <TabPane tab="图片" key="2">
                            <Text/>
                        </TabPane>
                        <TabPane tab="视频" key="3">
                            <Media/>
                        </TabPane>
                    </Tabs>
                </Modal>
            </div>
        )
    }
}

