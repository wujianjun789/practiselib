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
import { getSearchAssets, getSearchCount, getDeviceStatusByModelAndId } from '../../api/asset';
import { getMomentDate, momentDateFormat } from '../../util/time';

export default class Gateway extends Component {
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
            currentDomain: '',
            domainList: {
                titleField: 'name',
                valueField: 'name',
                options: []
            },
            currentControlMode: 'remote',
            controlModeList: {
                titleField: 'title',
                valueField: 'value',
                options: [
                    { title: '远程', value: 'remote' },
                    { title: '自动', value: 'auto' }
                ]
            }
        };

        this.model = 'gateway';

        this.columns = [
            { accessor: 'name', title: '设备名称' },
            { accessor: 'online', title: '通信状态' },
            { accessor: 'domain', title: '域' },
            { accessor: 'device', title: '设备状态' },
            { accessor: 'runningTime', title: '运行时间' },
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
    }

    updateDomainData(data, cb) {
        let currentDomain,
            options = data;
        if (data.length == 0) {
            currentDomain = null;
        } else {
            currentDomain = data[0];
        }
        this.setState({ domainList: { ...this.state.domainList, options }, currentDomain }, () => {
            cb && cb();
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

    onChange(e) {
        const { id, value } = e.target;
        switch (id) {
            case 'domain':
                let currentDomain = this.state.domainList.options[e.target.selectedIndex];
                this.setState({ currentDomain }, this.initDeviceData);
                break;
            case 'controlMode':
                this.setState({ currentControlMode: value });
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
    apply = () => {
        const { id } = this.state.currentDevice;
        const { currentControlMode } = this.state;
        console.log(id, currentControlMode)
        fetch(`/${id}/${currentControlMode}`)
            .then(res => {

            })
    }
    checkTime = () => {
        console.log('校验时间操作')
    }
    render() {
        const {
            page: { total, current, limit }, sidebarCollapse, currentDevice, deviceList,
            search: { value, placeholder }, currentDomain,
            domainList, currentControlMode, controlModeList
        } = this.state;
        const disabled = deviceList.length == 0 ? true : false;
        return <Content className={`list-lcc ${sidebarCollapse ? 'collapse' : ''}`}>
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
                    <span className={sidebarCollapse ? "icon_horizontal" : "icon_verital"}></span>
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
                            <span className="tit">控制模式：</span>
                            <Select id="controlMode" titleField={controlModeList.titleField} valueField={controlModeList.valueField}
                                options={controlModeList.options} value={currentControlMode} onChange={this.onChange} disabled={disabled} />
                            <button className="btn btn-primary" disabled={disabled} onClick={this.apply}>应用</button>
                        </div>
                        <div>
                            <span className="tit">校时：</span>
                            <span className="note">(点击以校准时间)</span>
                            <button className="btn btn-primary" disabled={disabled} onClick={this.checkTime}>校时</button>
                        </div>
                    </div>
                </div>
            </div>
        </Content>
    }
}

/**
 *  <Table columns={this.columns} keyField='id' data={deviceList} rowClick={this.tableClick}
                                activeId={currentDevice == null ? '' : currentDevice.id}/>
 */
