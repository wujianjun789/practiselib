/**
 * Created by Azrael on 2017/9/1.
 */
import '../../../public/styles/lightManage-list.less';
import React, { Component } from 'react';
import Content from '../../components/Content';
import SearchText from '../../components/SearchText';
import Select from '../../components/Select.1';
import TableWithHeader from '../components/TableWithHeader';
import TableTr from '../components/TableTr';
import Page from '../../components/Page';
import { getDomainList } from '../../api/domain';
import { getSearchAssets, getSearchCount, getDeviceStatusByModelAndId, updateAssetsRpcById } from '../../api/asset';
import { getLightLevelConfig } from '../../util/network';
import { getMomentDate, momentDateFormat } from '../../util/time';
import { message } from 'antd'
import 'antd/lib/message/style/css';
export default class SingleLampCon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: {
                total: 0,
                current: 1,
                limit: 10
            },
            search: {
                value: '',
                placeholder: '请输入设备名称',
            },
            sidebarCollapse: false,
            currentDevice: null,
            deviceList: [],
            currentDomain: null,
            domainList: {
                titleField: 'name',
                valueField: 'name',
                options: []
            },
            currentSwitchStatus: 'on',
            deviceSwitchList: {
                titleField: 'title',
                valueField: 'value',
                options: [
                    { value: 'on', title: '开启' },
                    { value: 'off', title: '关闭' }
                ]
            },
            currentBrightness: 0,
            brightnessList: {
                titleField: 'title',
                valueField: 'value',
                options: []
            },
        };

        this.model = 'lc';

        this.columns = [
            { accessor: 'name', title: '设备名称' },
            { accessor: 'online', title: '在线状态' },
            { accessor: 'device', title: '灯状态  ' },
            { accessor: 'switch', title: '开关状态' },
            { accessor: 'brightness', title: '亮度    ' },
            { accessor: 'voltage', title: '电压    ' },
            { accessor: 'current', title: '电流    ' },
            { accessor: 'power', title: '功率    ' },
            { accessor: 'totalPower', title: '总电能  ' },
            { accessor: 'runningTime', title: '运行时间' },
            { accessor: 'lightTime', title: '亮灯时间' },
            {
                accessor(data) {
                    return data.updateTime ? momentDateFormat(getMomentDate(data.updateTime, 'YYYY-MM-DDTHH:mm:ss Z'), 'YYYY/MM/DD HH:mm') : '';
                },
                title: '更新时间'
            }
        ];

        this.collapseHandler = this.collapseHandler.bind(this);
        this.onChange = this.onChange.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.searchChange = this.searchChange.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.tableClick = this.tableClick.bind(this);

        this.initData = this.initData.bind(this);
        this.updateDomainData = this.updateDomainData.bind(this);
        this.initDeviceData = this.initDeviceData.bind(this);
        this.updateDeviceData = this.updateDeviceData.bind(this);
        this.updatePageSize = this.updatePageSize.bind(this);
        this.updateBrightnessList = this.updateBrightnessList.bind(this);
    }
    componentWillMount() {
        this.mounted = true;
        this.initData();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    initData() {
        getDomainList((data) => {
            this.mounted && this.updateDomainData(data, this.initDeviceData);
        });
        getLightLevelConfig(this.updateBrightnessList);
    }

    updateDomainData(data, cb) {
        let currentDomain,
            options = data;
        if (data.length == 0) {
            currentDomain = null;
        } else {
            currentDomain = data[0];
        };
        this.setState({ domainList: { ...this.state.domainList, options }, currentDomain }, () => {
            cb && cb()
        });
    }

    initDeviceData(isSearch) {

        const { search: { value }, page, currentDomain } = this.state;
        if (isSearch) {
            page.current = 1;
            this.setState({ page: page });
        }
        const { limit, current } = this.state.page;
        const offset = limit * (current - 1);
        getSearchAssets(currentDomain ? currentDomain.id : null, this.model, value, offset, limit, this.mounted && this.updateDeviceData);
        getSearchCount(currentDomain ? currentDomain.id : null, this.model, value, this.mounted && this.updatePageSize);

    }

    updateDeviceData(data) {
        let currentDevice = data.length == 0 ? null : data[0];
        this.setState({ deviceList: data, currentDevice });
    }

    updatePageSize(data) {
        this.setState({ page: { ...this.state.page, total: data.count } })
    }

    updateBrightnessList(data) {
        // ["关", 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
        let opt = [];
        data.shift();   // 删除"关"
        data.forEach(value => {
            let val = value;
            let title = `亮度${val}`;
            opt.push({ value: val, title });
        });
        this.setState({ brightnessList: Object.assign({}, this.state.brightnessList, { options: opt }) });
    }

    onChange(e) {
        const { id, value } = e.target;
        switch (id) {
            case 'domain':
                let currentDomain = this.state.domainList.options[e.target.selectedIndex];
                this.setState({ currentDomain }, this.initDeviceData);
                break;
            case 'deviceSwitch':
                this.setState({ currentSwitchStatus: value });
                break;
            case 'dimming':
                this.setState({ currentBrightness: value });
                break;
        }
    }

    pageChange(page) {
        this.setState({ page: { ...this.state.page, current: page } }, this.initDeviceData);
    }

    searchChange(value) {
        this.setState({
            search: { ...this.state.search, value: value }
        })
    }

    searchSubmit() {
        this.initDeviceData(true);
    }

    collapseHandler() {
        this.setState({ sidebarCollapse: !this.state.sidebarCollapse });
    }

    tableClick(currentDevice) {
        this.setState({ currentDevice });
    }
    switchApply = () => {
        const { id } = this.state.currentDevice;
        const { currentSwitchStatus } = this.state;
        updateAssetsRpcById(id, { "status": currentSwitchStatus }, res => {
            if (res.success) {
                message.success('操作成功')
            } else {
                message.error('操作失败')
            }
        })
    }
    dimmingApply = () => {
        const { id } = this.state.currentDevice;
        const { currentBrightness } = this.state;
        updateAssetsRpcById(id, { "brightness": currentBrightness }, res => {
            if (res.success) {
                message.success('操作成功')
            } else {
                message.error('操作失败')
            }
        })
    }
    render() {
        const { page: { total, current, limit }, sidebarCollapse, currentDevice, deviceList,
            search: { value, placeholder }, currentDomain, domainList, deviceSwitchList,
            brightnessList, currentSwitchStatus, currentBrightness } = this.state;

        const disabled = deviceList.length == 0 ? true : false;
        return <Content className={`list-lc ${sidebarCollapse ? 'collapse' : ''}`}>
            <div className="content-left">
                <div className="heading">
                    <Select id='domain' titleField={domainList.titleField} valueField={domainList.valueField} options={domainList.options}
                        value={currentDomain == null ? '' : currentDomain[this.state.domainList.valueField]} onChange={this.onChange} />
                    <SearchText placeholder={placeholder} value={value} onChange={this.searchChange} submit={this.searchSubmit} />
                </div>
                <div className="table-container">
                    <TableWithHeader columns={this.columns}>
                        {
                            deviceList.map(item => <TableTr key={item.id} data={item} columns={this.columns} activeId={currentDevice.id}
                                rowClick={this.tableClick} willMountFuncs={[getDeviceStatusByModelAndId(this.model, item.id)]}
                            />)
                        }
                    </TableWithHeader>
                    <Page className={`page ${total == 0 ? "hidden" : ''}`} showSizeChanger pageSize={limit}
                        current={current} total={total} onChange={this.pageChange} />
                </div>
            </div>
            <div className={`container-fluid sidebar-info ${sidebarCollapse ? "sidebar-collapse" : ""}`}>
                <div className="row collapse-container" onClick={this.collapseHandler}>
                    <span className={sidebarCollapse ? "icon_horizontal" : "icon_vertical"}></span>
                </div>
                <div className="panel panel-default panel-1">
                    <div className="panel-heading">
                        <span className="icon_select"></span>选中设备
                            </div>
                    <div className="panel-body">
                        <span title={currentDevice == null ? '' : currentDevice.name}>{currentDevice == null ? '' : currentDevice.name}</span>
                    </div>
                </div>
                <div className="panel panel-default panel-2">
                    <div className="panel-heading">
                        <span className="icon_touch"></span>设备操作
                            </div>
                    <div className="panel-body">
                        <div>
                            <span className="tit">设备开关：</span>
                            <Select id="deviceSwitch" titleField={deviceSwitchList.titleField} valueField={deviceSwitchList.valueField}
                                options={deviceSwitchList.options} value={currentSwitchStatus} onChange={this.onChange} disabled={disabled} />
                            <button className="btn btn-primary" disabled={disabled} onClick={this.switchApply}>应用</button>
                        </div>
                        <div>
                            <span className="tit">调光：</span>
                            <Select id="dimming" titleField={brightnessList.titleField} valueField={brightnessList.valueField}
                                options={brightnessList.options} value={currentBrightness} onChange={this.onChange} disabled={disabled} />
                            <button className="btn btn-primary" disabled={disabled} onClick={this.dimmingApply}>应用</button>
                        </div>
                    </div>
                </div>
            </div>
        </Content>
    }
}

/**
 *                            <Table columns={this.columns} keyField='id' data={deviceList} rowClick={this.tableClick}
                                activeId={currentDevice == null ? '' : currentDevice.id}/>
 */
