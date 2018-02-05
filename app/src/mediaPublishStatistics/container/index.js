/**
 * Created by a on 2018/2/1.
 */
import React, { Component } from 'react';
import Content from '../../components/Content';
import '../../../public/styles/media-publish-stat.less'
export default class MediaPublishStatistics extends Component {

    render() {
        return (
            <Content>
                <div class='media-publish-stat'>
                    <h4>在线设备图</h4>
                    <div class='panel-body'>
                        <div class='left'></div>
                        <div class='right'>
                            <p>设备数：500</p>
                            <p>在线正常数：000</p>
                            <p>离线数：000</p>
                        </div>
                    </div>
                </div>
                <div class='media-publish-stat'>
                    <h4>设备故障图</h4>
                    <div class='panel-body'>
                        <div class='left'></div>
                        <div class='right'>
                            <p>设备数：500</p>
                            <p>正常故障数：000</p>
                            <p>故障设备数：000</p></div>
                    </div>
                </div>
            </Content>
        )
    }
}