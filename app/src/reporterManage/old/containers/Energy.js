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

		currentDeviceId: null,
		multiDeviceList: [],
		selectedMultiDeviceCollection: {},

		currentMode: 'device',
		modeList: [
			{ name: '按设备' },
			{ name: '按域' }
		],

		currentDomain: null,
		domainList: [
			{ name: '选择域' }
		],

		showDeviceName: '',
		visible: false,

		search: {
			value: '',
			placeholder: '输入设备名称'
		},

		page: { total: 0, current: 1, limit: 5 },
	}

	//初始化
	componentWillMount() {
		this._isMounted = true;
		this.model = 'lc';
		this.deviceColumns = [
			{ field: 'name', title: '设备名称' },
			{ field: 'id', title: '设备编号' }
		];
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

	//不同模式下拉菜单处理
	onChangeHandler = (e) => {
		const { id, selectedIndex } = e.target;
		switch (id) {
			case 'mode':
				if (selectedIndex === 1) {
					this.setState({ currentMode: 'domain' })
				} else if (selectedIndex === 0) {
					this.setState({ currentMode: 'device' })
				}
				break;
			case 'domain':
				this.setState({ currentDomain: this.state.domainList[selectedIndex] }, this.initDeviceData);
				break;
		}
	}

	//模态框
	showModal = () => {
		this.setState({ visible: !this.state.visible })
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

	//选择单一设备
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

	//改变分页
	changePagination = (index) => {
		const page = this.state.page;
		page.current = index;
		this.setState({ page }, this.initDeviceData)
	}

	componentDidUpdate() {
		const { currentMode, currentDomain, currentDeviceId } = this.state;
		console.log('currentMode', currentMode)
		console.log('currentDomain', currentDomain)
		console.log('currentDeviceId', currentDeviceId)
	}

	//应用
	onClickHandler = (e) => {
		const { id } = e.target;
		const { currentMode, currentDeviceId, currentDomain } = this.state;
		let body;
		if (currentMode === 'device') {
			body = {
				mode: currentMode, //模式
				device: currentDeviceId, //选中的参数
			}
			console.log(body)
		} else if (currentMode === 'domain') {
			body = {
				mode: currentMode,
				domain: currentDomain, //选中的设备id
			}
			console.log(body)
		}
	}

	render() {
		const { sidebarCollapse, startDate, endDate, currentMode, modeList, currentDomain, domainList, showDeviceName, visible,
			search: { value, placeholder }, multiDeviceList, currentDeviceId, page: { total, current, limit } } = this.state;
		let currentDomainName = null, applyDisabled = true, modePanel = null;
		if (currentDomain) {
			currentDomainName = currentDomain['name']
		}
		if (currentMode === 'device') {
			modePanel = <div class='device-select-mode param-select-panel'>
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
			</div>;
			if (currentDeviceId !== null) {
				applyDisabled = false;
			}
		} else if (currentMode === 'domain') {
			modePanel = <Select1 id='domain' className='select-domain' options={domainList} current={currentDomainName} onChange={this.onChangeHandler} />
			if (currentDomain !== null) {
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
							<span class='icon_select'></span>统计参数
						</div>
						<div class='panel-body'>
							<div class='device-filter'>
								<Select1 id='mode' options={modeList} onChange={this.onChangeHandler} />
								{modePanel}
								<div class='btn-group-right'>
									<button id='apply' class='btn btn-primary fix-margin' disabled={applyDisabled} onClick={this.onClickHandler}>应用</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Content >
		)
	}
}