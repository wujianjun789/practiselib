import React, { Component } from 'react'

import Content from '../../../components/Content';
import Select1 from '../../component/select.1';
import Select2 from '../../component/select.2'
import SearchText from '../../../components/SearchText';
import { DatePicker } from 'antd';
import Chart from '../../utils/multiLineChartWithZoomAndBrush';

import { getYesterday, getToday } from '../../../util/time';
import { getDomainList } from '../../../api/domain'
import { getSearchAssets, getSearchCount } from '../../../api/asset'

import '../../../../public/styles/reporterManage-device.less';

export default class Lc extends Component {
    state = {
        sidebarCollapse: false,
        startDate: getYesterday(),
        endDate: getToday(),

        currentMode: null,
        modeList: [
            { value: '采样方式', disabled: true, hidden: true },
            { value: '多设备' },
            { value: '多参数' }
        ],

        currentParam: null,
        paramList: [
            { value: '采样参数', disabled: true, hidden: true },
            { value: '亮度' },
            { value: '电流' },
            { value: '电压' },
            { value: '功率' }
        ],

        currentDomain: null,
        domainList: [],

        search: {
            value: '',
            placeholder: '输入编号或名称'
        },
        deviceList: [],
        selectDeviceIds: [],
        selectDevices: {},
        page: { total: 0, current: 1, limit: 5 }
    }

    //初始化
    componentWillMount() {
        this._isMounted = true;
        this.model = 'lc';
        this.initDomainData();
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    initDomainData = () => {
        getDomainList(data => {
            this._isMounted && this.updateDomainData(data);
        })
    }
    updateDomainData = (data) => {
        if (data.length === 0) {
            this.setState({ domainList: [{ name: '选择域' }] })
        } else {
            this.setState({ currentDomain: data[0], domainList: data }, this.initDeviceData)
        }
    }

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

    updatePageSize = (data) => {
        const page = this.state.page;
        page.total = data.count;
        this._isMounted && this.setState({ page })
    }
    updateDeviceData = (data) => {
        this._isMounted && this.setState({ deviceList: data })
    }


    componentDidUpdate() {
        // console.log(this.state.domainList, this.state.currentDomain)
        const { page: { current, limit, total }, currentDomain, deviceList } = this.state;
        console.log(current, total, currentDomain, deviceList)
    }
    // initDeviceData = () => {
    //     const { search: { value }, page, currentDomain } = this.state;
    //     if (isSearch !== undefined) {
    //         page.current = 1;
    //         this.setState({ page: page })
    //     }
    //     const { limit, current } = this.state.page;
    //     const offset = limit * (current - 1);
    //     getSearchAssets(currentDomain ? currentDomain.id : null, )
    // }
    //d3图表
    drawLineChart = (node) => {
        const { selectDevices, startDate, endDate } = this.state;
        this.chart = new Chart({
            wrapper: node,
            data: Object.values(selectDevices),
            xAccessor: d => d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ")(d.timestamp),
            yAccessor: d => d.value,
            xDomain: [startDate, endDate],
            yDomain: [0, 100],
            curveFactory: d3.curveStepAfter,
            yTickFormat: d => { if (d === 0) return ''; return `${d}` },
            tooltipAccessor: d => d.y
        })
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

    render() {
        const { sidebarCollapse, startDate, endDate, currentMode, modeList, currentParam, paramList, currentDomain, domainList, search: { value, placeholder },
            deviceList, selectDeviceIds, selectDevices, page: { total, current, limit }, } = this.state;
        return (
            <Content class={`device-lc ${sidebarCollapse ? 'collapse' : ''}`}>
                <div class='content-left'>
                    <div class='chart-container' ref={this.drawLineChart}></div>
                </div>
                <div class={`container-fluid sidebar-info ${sidebarCollapse ? 'sidebar-collapse' : ''}`}>
                    <div class='row collapse-container' onClick={this.collapseHandler}>
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
                                <Select1 id='mode' disabled={false} options={modeList} onChange={this.onChangeHandler} />
                                <Select1 id='param' disabled={currentMode === 1 ? false : true} options={paramList} onChange={this.onChangeHandler} />
                            </div>
                            <div class=''>
                                <Select2 id='domain' options={domainList} onChange={this.onChangeHandler} />
                                <SearchText placeholder={placeholder} value={value} onChange={this.searchChange} submit={this.searchSubmit} />
                            </div>
                        </div>
                    </div>
                </div>
            </Content>
        )
    }
}