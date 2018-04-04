import React from 'react';
import Content from '../../../components/Content';
import Select from '../../component/select'
import PieChart from '../../../components/PieChart'
import { getChildDomainList } from '../../../api/domain'
import { getStatDeviceCount } from '../../../api/reporter'
import '../../../../public/styles/media-publish-stat.less'
import '../../../../public/styles/reporterManage-lighting.less'
export default class Lighting extends React.Component {
    state = {
        domainList: [
            { name: '选择域' }
        ],
        currentDomain: null,
        count: 0,
        inline: 0,
        outline: 0,
        normal: 0,
        fault: 0,
    }
    componentWillMount() {
        this._isMounted = true;
    }
    componentDidMount() {
        this.initDomainData();
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    initDomainData = () => {
        getChildDomainList(data => {
            this._isMounted && this.updateDomainData(data)
        })
    }
    updateDomainData = data => {
        if (!data.length) {
            return;
        }
        this.setState({ currentDomain: data[0], domainList: data }, this.initDeviceData);
    }
    initDeviceData = () => {
        getStatDeviceCount(this.state.currentDomain, res => {
            const { count, inline, outline, normal, fault } = res;
            this.setState({ count, inline, outline, normal, fault })
        })
    }
    onChangeHandler = e => {
        const { id, selectedIndex } = e.target;
        if (id === 'domain') {
            this.setState({
                currentDomain: this.state.domainList[selectedIndex]
            }, this.initDeviceData)
        }
    }
    render() {
        const { domainList, currentDomain, count, inline, outline, normal, fault } = this.state;
        const dataSource1 = {
            key: 'lighting',
            values: [
                { region: 'inline', count: inline },
                { region: 'outline', count: outline }
            ]
        };
        const dataSource2 = {
            key: 'failure',
            values: [
                { region: 'normal', count: normal },
                { region: 'fault', count: fault }
            ]
        }
        return (
            <Content class='stat-lighting'>
                <div class='heading'>
                    <Select className='select-domain' id='domain' options={domainList} current={currentDomain} onChange={this.onChangeHandler} />
                </div>
                <div class='contaienr'>
                    <div class='media-publish-stat'>
                        <h4>亮灯率</h4>
                        <div class='normal-device clearfix'>
                            <PieChart id='normal-device' className='left' dataSource={dataSource1} color={['#fa919c', '#f83d59']} />
                            <span class={`device-null-tip ${count ? 'hidden' : ''}`}>暂无设备</span>
                            <div class='right'>
                                <h5>设备数：{count}</h5>
                                <p><i class='dot normal-inline' />在线：{inline}</p>
                                <p><i class='dot normal-outline' />离线：{outline}</p>
                            </div>
                        </div>
                    </div>
                    <div class='media-publish-stat'>
                        <h4>故障率</h4>
                        <div class='fault-device clearfix'>
                            <PieChart id='fault-device' className='left' dataSource={dataSource2} />
                            <span class={`device-null-tip ${count ? 'hidden' : ''}`}>暂无设备</span>
                            <div class='right'>
                                <h5>设备数：{count}</h5>
                                <p><i class='dot fault-inline' />正常：{normal}</p>
                                <p><i class='dot fault-outline' />故障：{fault}</p></div>
                        </div>
                    </div>
                </div>
            </Content>
        )
    }
}