import React, { Component } from 'react'
import Immutable from 'immutable';
import Content from '../../../components/Content';
import SearchText from '../../../components/SearchText';
import Table from '../../../components/Table';
import Page from '../../../components/Page';
import Select from '../../component/select';
import Chart from '../../component/chart';
import { DatePicker } from 'antd';
import Modal from 'antd/lib/modal';
import '../../../../public/styles/antd-modal.less'
import { getYesterday, getToday } from '../../../util/time';
import { getDomainList } from '../../../api/domain'
import { getSearchAssets, getSearchCount } from '../../../api/asset'
import '../../../../public/styles/reporterManage-device.less';

export default class Lc extends Component {
	state = {
		sidebarCollapse: false,
		startDate: getYesterday(),
		endDate: getToday(),

		currentMode: 'device',
		currentDomain: null,
		currentDeviceId: null,
		modeList: [
			{ name: '按设备' },
			{ name: '按域' }
		],
		domainList: [
			{ name: '选择域' }
		],
		multiDeviceList: [],

		showDeviceName: '',
		visible: false,
		search: { value: '', placeholder: '输入设备名称' },
		page: { total: 0, current: 1, limit: 5 },


		data: {},
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
		if (isSearch) {
			this.setState({ page: { ...this.state.page, current: 1 } })
		}
		if (this.state.currentDomain) {
			const { currentDomain, search: { value }, page: { current, limit } } = this.state;
			const offset = limit * (current - 1);
			getSearchCount(currentDomain.id, this.model, value, this.updatePageSize);
			getSearchAssets(currentDomain.id, this.model, value, offset, limit, this.updateDeviceData);
		}
	}
	updateDeviceData = (data) => {
		this._isMounted && this.setState({ multiDeviceList: data })
	}

	//侧边栏展开关闭、选择起始日期
	collapseHandler = () => {
		this.setState({ sidebarCollapse: !this.state.sidebarCollapse })
	}
	startDateChange = (date, dateStr) => {
		this.setState({ startDate: date })
	}
	endDateChange = (date, dateStr) => {
		this.setState({ endDate: date })
	}

	//模态框、搜索栏、分页
	showModal = () => {
		this.setState({ visible: !this.state.visible })
	}
	searchChange = (value) => {
		this.setState({ search: { ...this.state.search, value } })
	}
	searchSubmit = () => {
		this.initDeviceData(true)
	}
	updatePageSize = (data) => {
		this._isMounted && this.setState({ page: { ...this.state.page, total: data.count } })
	}
	changePagination = (index) => {
		this.setState({ page: { ...this.state.page, current: index } }, this.initDeviceData)
	}

	//选择单一设备
	selectSingleDevice = (rowId, checked) => {
		const { currentDeviceId, showDeviceName, multiDeviceList } = this.state;
		if (checked) {
			this.setState({
				currentDeviceId: rowId,
				showDeviceName: multiDeviceList.find(item => item.id === rowId)['name']
			})
		} else {
			this.setState({ currentDeviceId: null, showDeviceName: '' })
		}
	}

	//不同模式下拉菜单处理
	onChangeHandler = (e) => {
		const { id, selectedIndex } = e.target;
		if (id === 'mode') {
			switch (selectedIndex) {
				case 0:
					this.setState({ currentMode: 'device' })
					break;
				case 1:
					this.setState({ currentMode: 'domain' })
					break;
			}
		}
		if (id === 'domain') {
			this.setState({ currentDomain: this.state.domainList[selectedIndex] }, this.initDeviceData);
		}
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
	//测试数据
	componentDidUpdate() {
		const { currentMode, currentDomain, currentDeviceId } = this.state;
		console.log('currentMode', currentMode)
		console.log('currentDomain', currentDomain)
		console.log('currentDeviceId', currentDeviceId)
	}

	render() {
		const { sidebarCollapse, startDate, endDate, currentMode, modeList, currentDomain, domainList, currentDeviceId, multiDeviceList,
			showDeviceName, visible, search: { value, placeholder }, page: { total, current, limit }, data, } = this.state;

		let currentDomainName = null, applyDisabled = true, modePanel = null;
		if (currentDomain) {
			currentDomainName = currentDomain['name']
		}
		switch (currentMode) {
			case 'device': {
				if (currentDeviceId !== null) {
					applyDisabled = false;
				}
				modePanel = <div class='device-select-mode param-select-panel'>
					<div class='select-device'>
						<input disabled value={showDeviceName} />
						<button class='btn btn-gray' onClick={this.showModal}>选择设备</button>
					</div>
					<Modal class='reporter-modal' title='选择设备' visible={visible} onCancel={this.showModal} onOk={this.showModal} maskClosable={false}>
						<div class='select-input'>
							<Select id='domain' className='' options={domainList} current={currentDomainName} onChange={this.onChangeHandler} />
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
			}; break;
			case 'domain': {
				if (currentDomain !== null) {
					applyDisabled = false;
				}
				modePanel = <Select id='domain' className='select-domain' options={domainList} current={currentDomainName} onChange={this.onChangeHandler} />
			}
				break;
		}

		return (
			<Content class={`device-lc ${sidebarCollapse ? 'collapse' : ''}`}>
				<div class='content-left'>
					<Chart start={startDate} end={endDate} data={data} />
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
								allowClear={false} onChange={this.startDateChange} />
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
							<div class='state-select-mode'>
								<Select class='select-mode' id='mode' options={modeList} onChange={this.onChangeHandler} />
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