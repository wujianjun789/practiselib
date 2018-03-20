/**
 * Created by a on 2018/2/1.
 */
import React, { Component } from 'react';
import Content from '../../components/Content';
import PieChart from '../../components/PieChart'
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
        this.initDeviceCount()
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    initDeviceCount = () => {
        getStatDeviceCount(res => {
            const { count, inline, outline, normal, fault } = res;
            this.setState({ count, inline, outline, normal, fault })
        })
    }
    //ref函数会在DidMount之后，WillUnmount之后各执行一次,render的时候不执行


    render() {
        const { count, inline, outline, normal, fault } = this.state;
        const dataSource1 = {
            key: 'normal',
            values: [
                { region: 'inline', count: inline },
                { region: 'outline', count: outline }
            ]
        }
        const dataSource2 = {
            key: 'fault',
            values: [
                { region: 'normal', count: normal },
                { region: 'fault', count: fault }
            ]
        }
        return (
            <Content>
                <div class='media-publish-stat'>
                    <h4>在线设备图</h4>
                    <div class='normal-device clearfix'>
                        {count ? <PieChart id='normal-device' className='left' dataSource={dataSource1} color={['#fa919c', '#f83d59']} />
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
                        {count ? <PieChart id='fault-device' className='left' dataSource={dataSource2} />
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