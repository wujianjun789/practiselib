/**
 * Created by a on 2018/2/1.
 */
import React, { Component } from 'react';
import Content from '../../components/Content';
import PieChart from '../util/pieChart'
import '../../../public/styles/media-publish-stat.less'

export default class MediaPublishStatistics extends Component {
    componentWillMount() {
        //当有ref回调函数时，需要注意
        this._isMounted = true;
        this.normalChart = null;
        this.faultChart = null;
    }
    componentWillUnmount() {
        this.destoryChart()
        this._isMounted = false;
    }
    //ref函数会在DidMount之前，WillUnmount之后各执行一次。
    drawChart = (node) => {
        if (!this._isMounted) {
            return;
        }
        switch (node.id) {
            case 'normal-device': {
                const data = [400, 100];
                this.normalChart = new PieChart(node, data);
                break;
            }
            case 'fault-device': {
                const data = [300, 200];
                this.faultChart = new PieChart(node, data);
                break;
            }
            default:
                throw new Error('unknow element')
                break;
        }
    }
    updateChart = () => {

    }
    destoryChart = () => {
        this.normalChart.destory();
        this.faultChart.destory();
        this.normalChart = null;
        this.faultChart = null;
    }
    render() {
        return (
            <Content>
                <div class='media-publish-stat'>
                    <h4>在线设备图</h4>
                    <div class='normal-device clearfix'>
                        <div id='normal-device' class='left' ref={this.drawChart}></div>
                        <div class='right'>
                            <h5>设备数：500</h5>
                            <p>在线正常数：100</p>
                            <p>离线数：400</p>
                        </div>
                    </div>
                </div>
                <div class='media-publish-stat'>
                    <h4>设备故障图</h4>
                    <div class='fault-device clearfix'>
                        <div id='fault-device' class='left' ref={this.drawChart}></div>
                        <div class='right'>
                            <h5>设备数：500</h5>
                            <p>正常故障数：200</p>
                            <p>故障设备数：200</p></div>
                    </div>
                </div>
            </Content>
        )
    }
}