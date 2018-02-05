/**
 * Created by a on 2018/2/1.
 */
import React, { Component } from 'react';
import Content from '../../components/Content';
import PieChart from '../util/pieChart'
import '../../../public/styles/media-publish-stat.less'
import { getStatDeviceCount } from '../../api/mediaPublish';

export default class MediaPublishStatistics extends Component {
    state = {
        count: 0,
        inline: 0,
        outline: 0,
        normal: 0,
        fault: 0,
    }
    componentWillMount() {
        //当有ref回调函数时，需要注意
        this._isMounted = true;
        this.normalChart = null;
        this.faultChart = null;
        getStatDeviceCount(res => {
            const { count, inline, outline, normal, fault } = res;
            this.setState({ count, inline, outline, normal, fault })
        })
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
                const data = [this.state.inline, this.state.outline];
                const color = ['#fa919c', '#f83d59']
                this.normalChart = new PieChart(node, data, color);
                break;
            }
            case 'fault-device': {
                const data = [this.state.normal, this.state.fault];
                this.faultChart = new PieChart(node, data);
                break;
            }
            default:
                throw new Error('unknow element')
                break;
        }
    }
    destoryChart = () => {
        this.normalChart.destory();
        this.faultChart.destory();
        this.normalChart = null;
        this.faultChart = null;
    }
    render() {
        const { count, inline, outline, normal, fault, show } = this.state;
        return (
            <Content>
                <div class='media-publish-stat'>
                    <h4>在线设备图</h4>
                    <div class='normal-device clearfix'>
                        {count ? <div id='normal-device' class='left' ref={this.drawChart}></div>
                            : <div class='left'>暂无设备</div>
                        }
                        <div class='right'>
                            <h5>设备数：{count}</h5>
                            <p><i class='dot normal-inline' />在线：{inline}</p>
                            <p><i class='dot normal-outline' />离线：{outline}</p>
                        </div>
                    </div>
                </div>
                <div class='media-publish-stat'>
                    <h4>设备故障图</h4>
                    <div class='fault-device clearfix'>
                        {count ? <div id='fault-device' class='left' ref={this.drawChart}></div>
                            : <div class='left'>暂无设备</div>
                        }
                        <div class='right'>
                            <h5>设备数：{count}</h5>
                            <p><i class='dot fault-inline' />正常：{normal}</p>
                            <p><i class='dot fault-outline' />故障：{fault}</p></div>
                    </div>
                </div>
            </Content>
        )
    }
}