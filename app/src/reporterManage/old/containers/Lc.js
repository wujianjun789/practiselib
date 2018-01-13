import React, { Component } from 'react'
import Immutable from 'immutable';

import Content from '../../../components/Content';
import Select1 from '../../component/select.1';
import SearchText from '../../../components/SearchText';
import Table from '../../../components/Table';
import Page from '../../../components/Page';
import { DatePicker } from 'antd';
import Modal from 'antd/lib/modal';
import '../../../../public/styles/antd-modal.less'

import '../../../../public/styles/reporterManage-device.less';
import Chart from '../../utils/multiLineChartWithZoomAndBrush';
import { getYesterday, getToday } from '../../../util/time';
import { getDomainList } from '../../../api/domain'
import { getSearchAssets, getSearchCount } from '../../../api/asset'


export default class Lc extends Component {
    state = {
        sidebarCollapse: false,
        startDate: getYesterday(),
        endDate: getToday(),

        currentMode: null,
        modeList: [
            { name: '采样方式', hidden: true },
            { name: '多设备' },
            { name: '多参数' }
        ],

        currentParam: null,
        paramList: [
            { name: '采样参数', hidden: true },
            { name: '亮度' },
            { name: '电流' },
            { name: '电压' },
            { name: '功率' }
        ],

        currentDomain: null,
        domainList: [
            { name: '选择域' }
        ],

        search: {
            value: '',
            placeholder: '输入设备名称'
        },

        multiDeviceList: [],
        selectedMultiDeviceIdList: [],
        selectedMultiDeviceCollection: {},

        multiParamList: [
            { param: '亮度', unit: '%' },
            { param: '电压', unit: 'V' },
            { param: '电流', unit: 'A' },
            { param: '功率', unit: 'W' },
        ],
        selectedMultiParamIdList: [],
        selectedMultiParamCollection: {},

        page: { total: 0, current: 1, limit: 5 },

        currentDeviceId: null,
        showDeviceName: '',
        visible: false,

    }

    //初始化
    componentWillMount() {
        this._isMounted = true;
        this.model = 'lc';
        this.deviceColumns = [
            { field: 'name', title: '设备名称' },
            { field: 'id', title: '设备编号' }
        ];
        this.paramColumns = [
            { field: 'param', title: '采样参数' },
            { field: 'unit', title: '单位' }
        ]
        this.maxSelectNum = 5;
        this.initDomainData();
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    //初始化域、更新域列表
    initDomainData = () => {
        getDomainList(data => {
            this._isMounted && this.updateDomainData(data);
        })
    }
    updateDomainData = (data) => {
        if (data.length === 0) {
            return;
        } else {
            this.setState({ currentDomain: data[0], domainList: data }, this.initDeviceData)
        }
    }

    //初始化设备、更新设备列表、选择设备
    initDeviceData = (isSearch) => {
        if (!this._isMounted) {
            return;
        }
        const { page, currentDomain } = this.state;
        if (isSearch) {
            page.current = 1;
            this._isMounted && this.setState({ page: page })
        }
        if (currentDomain) {
            const { search: { value }, page: { current, limit } } = this.state;
            const offset = limit * (current - 1);
            getSearchCount(currentDomain.id, this.model, value, this.updatePageSize);
            getSearchAssets(currentDomain.id, this.model, value, offset, limit, this.updateDeviceData);
        }
    }
    updateDeviceData = (data) => {
        this._isMounted && this.setState({ multiDeviceList: data })
    }

    //更新分页面板
    updatePageSize = (data) => {
        const page = this.state.page;
        page.total = data.count;
        this._isMounted && this.setState({ page })
    }
    changePagination = (index) => {
        const page = this.state.page;
        page.current = index;
        this.setState({ page }, this.initDeviceData)
    }

    //搜索栏
    searchChange = (value) => {
        const search = this.state.search;
        search.value = value;
        this._isMounted && this.setState({ search })
    }
    searchSubmit = () => {
        this.initDeviceData(true)
    }

    componentDidUpdate() {
        const { currentDomain,multiDeviceList } = this.state;
        console.log(multiDeviceList)
        console.log(currentDomain)
    }

    //d3图表
    drawLineChart = (node) => {
        const { selectedMultiDeviceCollection, startDate, endDate } = this.state;
        this.chart = new Chart({
            wrapper: node,
            data: Object.values(selectedMultiDeviceCollection),
            xAccessor: d => d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ")(d.timestamp),
            yAccessor: d => d.value,
            xDomain: [startDate, endDate],
            yDomain: [0, 100],
            curveFactory: d3.curveStepAfter,
            yTickFormat: d => { if (d === 0) return ''; return `${d}` },
            tooltipAccessor: d => d.y
        })
    }
    getChartData = (cb) => {
    }

    //侧边栏展开关闭
    collapseHandler = () => {
        this.setState({ sidebarCollapse: !this.state.sidebarCollapse })
    }

    //选择起始日期
    startDateChange = (date, dateStr) => {
        this.setState({ startDate: date })
    }
    endDateChange = (date, dateStr) => {
        this.setState({ endDate: date })
    }

    //选择采样模式、采样参数、选择域
    onChangeHandler = (e) => {
        const { id, selectedIndex } = e.target;
        switch (id) {
            case 'mode':
                this.setState({ currentMode: selectedIndex })
                break;
            case 'param':
                this.setState({ currentParam: selectedIndex })
                break;
            case 'domain':
                this.setState({ currentDomain: this.state.domainList[selectedIndex] }, this.initDeviceData);
                break;
        }
    }

    //应用
    onClickHandler = (e) => {
        const { id } = e.target;
        // switch (id) {
        //     case 'apply':
        //         console.log('获取数据并在图表中渲染出来')
        //         break;

        // }
        const { currentMode, currentParam, selectedMultiDeviceIdList, currentDeviceId, selectedMultiParamIdList } = this.state;
        let body;
        if (currentMode === 1) {
            body = {
                mode: 'multiDevice', //模式
                param: currentParam, //选中的参数
                deviceList: selectedMultiDeviceIdList //设备id列表
            }
            console.log(body)
        } else if (currentMode === 2) {
            body = {
                mode: 'multiParam',
                device: currentDeviceId, //选中的设备id
                paramList: selectedMultiParamIdList //参数列表
            }
            console.log(body)
        }
    }

    showModal = () => {
        this.setState({ visible: !this.state.visible })
    }
    selectDevice = (rowId, checked) => {
        const { multiDeviceList, selectedMultiDeviceIdList, selectedMultiDeviceCollection } = this.state;
        if (checked) {
            if (selectedMultiDeviceIdList.length < this.maxSelectNum) {
                this.setState({
                    selectedMultiDeviceIdList: [...selectedMultiDeviceIdList, rowId],
                    // selectedMultiDeviceCollection: { ...selectedMultiDeviceCollection, [rowId]: multiDeviceList.find(item => item.id === rowId) }
                })
            }
        } else {
            selectedMultiDeviceIdList.splice(selectedMultiDeviceIdList.findIndex(item => item === rowId), 1) //注意，此处一定要指明删除数量为1
            // delete selectedMultiDeviceCollection[rowId]
            this.setState({
                selectedMultiDeviceIdList,
                // selectedMultiDeviceCollection
            })
        }
    }
    selectSingleDevice = (rowId, checked) => {
        let { currentDeviceId, showDeviceName, multiDeviceList } = this.state;
        if (checked) {
            this.setState({
                currentDeviceId: rowId,
                showDeviceName: multiDeviceList.find(item => item.id === rowId)['name']
            })

        } else {
            currentDeviceId = null;
            this.setState({ currentDeviceId, showDeviceName: '' })
        }
    }
    selectParam = (rowId, checked) => {
        const { multiParamList, selectedMultiParamIdList, selectedMultiParamCollection } = this.state;
        if (checked) {
            this.setState({
                selectedMultiParamIdList: [...selectedMultiParamIdList, rowId],
                // selectedMultiParamCollection: { ...selectedMultiParamCollection, [rowId]: multiParamList.find(item => item.param === rowId) }
            })
        } else {
            selectedMultiParamIdList.splice(selectedMultiParamIdList.findIndex(item => item === rowId), 1);
            // delete selectedMultiParamCollection[rowId]
            this.setState({
                selectedMultiParamIdList,
                // selectedMultiParamCollection
            })
        }
    }
    render() {
        const { sidebarCollapse, startDate, endDate, currentMode, modeList, currentParam, paramList, currentDomain, domainList, search: { value, placeholder },
            multiDeviceList, selectedMultiDeviceIdList, page: { total, current, limit }, showDeviceName, visible, multiParamList,
            selectedMultiParamIdList, currentDeviceId } = this.state;
        let devicePanel = null, applyDisabled = true, currentDomainName = null;

        if (currentDomain) {
            currentDomainName = currentDomain['name']
        }

        if (currentMode === 1) {
            devicePanel = <div class='device-select-mode'>
                <Select1 id='domain' className='select-domain' options={domainList} current={currentDomainName} onChange={this.onChangeHandler} />
                <SearchText className='search-text' placeholder={placeholder} value={value} onChange={this.searchChange} submit={this.searchSubmit} />
                <Table columns={this.deviceColumns} data={Immutable.fromJS(multiDeviceList)} allChecked={false} checked={selectedMultiDeviceIdList} rowCheckChange={this.selectDevice} />
                <div class={`page-center ${total === 0 ? 'hidden' : ''}`}>
                    <Page class='page' showSizeChanger pageSize={limit} current={current} total={total} onChange={this.changePagination} />
                </div>
            </div>;
            if (currentParam !== null && selectedMultiDeviceIdList.length) {
                applyDisabled = false;
            }
        } else if (currentMode === 2) {
            devicePanel = <div class='device-select-mode param-select-panel'>
                <div class='select-device'>
                    <input disabled value={showDeviceName} />
                    <button class='btn btn-gray' onClick={this.showModal}>选择设备</button>
                </div>
                <Modal class='reporter-modal' title='选择设备' visible={visible} onCancel={this.showModal} onOk={this.showModal} maskClosable={false}>
                    <div class='select-input'>
                        <Select1 id='domain' className='' options={domainList} current={currentDomainName} onChange={this.onChangeHandler} />
                        <SearchText className='' placeholder={placeholder} value={value} onChange={this.searchChange} submit={this.searchSubmit} />
                    </div>
                    <div class='select-panel'>
                        <Table columns={this.deviceColumns} data={Immutable.fromJS(multiDeviceList)} allChecked={false} checked={currentDeviceId ? [currentDeviceId] : []} rowCheckChange={this.selectSingleDevice} />
                        <div class={`page-center ${total === 0 ? 'hidden' : ''}`}>
                            <Page class='page' showSizeChanger pageSize={limit} current={current} total={total} onChange={this.changePagination} />
                        </div>
                    </div>
                </Modal>
                <Table columns={this.paramColumns} data={Immutable.fromJS(multiParamList)} allChecked={false}
                    keyField='param' checked={selectedMultiParamIdList} rowCheckChange={this.selectParam} />

            </div>
            if (currentDeviceId !== null && selectedMultiParamIdList.length) {
                applyDisabled = false;
            }
        }
        return (
            <Content class={`device-lc ${sidebarCollapse ? 'collapse' : ''}`}>
                <div class='content-left'>
                    <div class='chart-container' ref={this.drawLineChart}></div>
                </div>
                <div class={`container-fluid sidebar-info ${sidebarCollapse ? 'sidebar-collapse' : ''}`}>
                    <div class='row collapse-container fix-width' onClick={this.collapseHandler}>
                        <span class={sidebarCollapse ? 'icon_horizontal' : 'icon_vertical'}></span>
                    </div>
                    <div class='panel panel-default panel-1'>
                        <div class='panel-heading'>
                            <span class='icon_touch'></span>选择时间
						</div>
                        <div class='panel-body'>
                            <DatePicker class='start-date' placeholder='选择起始日期' value={startDate}
                                allowClear={false} locale={'zh'} onChange={this.startDateChange} />
                            <span>至</span>
                            <DatePicker class='start-date' placeholder='选择结束日期' value={endDate}
                                allowClear={false} onChange={this.endDateChange} />
                        </div>
                    </div>
                    <div class='panel panel-default panel-2'>
                        <div class='panel-heading'>
                            <span class='icon_select'></span>选中设备
						</div>
                        <div class='panel-body'>
                            <div class='device-filter'>
                                <Select1 id='mode' options={modeList} onChange={this.onChangeHandler} />
                                <Select1 id='param' disabled={currentMode !== 1 ? true : false} options={paramList} onChange={this.onChangeHandler} />
                            </div>
                            {devicePanel}
                            <div class='btn-group-right'>
                                <button id='apply' class='btn btn-primary fix-margin' disabled={applyDisabled} onClick={this.onClickHandler}>应用</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Content >
        )
    }
}