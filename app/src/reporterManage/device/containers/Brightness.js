/**
 * Created by Azrael on 2017/9/1.
 */
import '../../../../public/styles/reporterManage-device.less';
import React, { PureComponent } from 'react';
import Content from '../../../components/Content';
import Select from '../../../components/Select.1';
import SearchText from '../../../components/SearchText';
import Table from '../../../components/Table';
import Page from '../../../components/Page';
import Chart from '../../utils/multiLineChartWithZoomAndBrush';
import DatePicker from 'antd/lib/date-picker';  // 加载 JS
import 'antd/lib/date-picker/style/css';        // 加载 CSS
import Immutable from 'immutable';
import {getDomainList} from '../../../api/domain';
import {getSearchAssets, getSearchCount} from '../../../api/asset';
import {getHistoriesDataByAssetId} from '../../../api/reporter';
import {getToday, getYesterday} from '../../../util/time';
import moment from 'moment';

export default class Brightness extends PureComponent {
    constructor(props) {
		super(props);
        this.state = {
			startDate: getYesterday(),
			endDate: getToday(),
            page: {
                total: 0,
                current: 1,
                limit: 8
            },
            search: {
                value: '',
                placeholder: '输入编号或名称',

            },
			sidebarCollapse: false,
			currentDomain: null,
            domainList: {
                titleField: 'name',
                valueField: 'name',
                options: []
			},
			deviceList: [],
			selectDevices: [],/* selectDevices */
			chartData: []/* selectDevices */
		};

		this.chart = null;
		this.columns = [
			{field: 'name', title: '设备名称'},
			{field: 'id', title: '设备编号'},
		];
		this.maxNumofSelectDevices = 5;

        this.collapseHandler = this.collapseHandler.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.searchChange = this.searchChange.bind(this);
		this.searchSubmit = this.searchSubmit.bind(this);
		this.onChange = this.onChange.bind(this);
		this.startDateChange = this.startDateChange.bind(this);
		this.endDateChange = this.endDateChange.bind(this);
		this.tableRowCheckChange = this.tableRowCheckChange.bind(this);
		this.onClick = this.onClick.bind(this);

		this.drawLineChart = this.drawLineChart.bind(this);
		this.updateLineChart = this.updateLineChart.bind(this);
		this.destroyLineChart = this.destroyLineChart.bind(this);

		this.initData = this.initData.bind(this);
		this.initDeviceData = this.initDeviceData.bind(this);
		this.updateDeviceData = this.updateDeviceData.bind(this);
		this.updateDomainData = this.updateDomainData.bind(this);
		this.updatePageSize = this.updatePageSize.bind(this);
		this.getChartData = this.getChartData.bind(this);
    }

    componentWillMount() {
		this.mounted = true;
		this.initData();
    }

    componentWillUnmount() {
        this.mounted = false;
	}

	initData() {
        getDomainList((data) =>{
            this.mounted && this.updateDomainData(data, this.initDeviceData);
        });
	}

	initDeviceData(isSearch) {
        const {search: {value}, page, currentDomain} = this.state;
        if(isSearch){
            page.current = 1;
            this.setState({page:page});
        }

        const {limit, current} = this.state.page;
        const offset = limit * ( current - 1 );
        getSearchAssets(currentDomain?currentDomain.id:null, this.model, value, offset, limit, this.mounted&&this.updateDeviceData);
        getSearchCount(currentDomain?currentDomain.id:null, this.model, value, this.mounted&&this.updatePageSize);
	}

	updateDeviceData(data) {
        this.setState({deviceList: data});
    }

	updateDomainData(data, cb) {
        let currentDomain,
            options;
        if (data.length == 0) {
			currentDomain = null;
			options = [{name: '选择域'}];
        } else {
			currentDomain = data[0];
			options = data;
        }
        this.setState({domainList: {...this.state.domainList, options}, currentDomain }, ()=>{
            cb && cb()
        });
    }

    updatePageSize(data) {
        this.setState({page: {...this.state.page, total: data.count}})
    }

    pageChange(page) {
        this.setState({page: {...this.state.page, current: page}}, this.initDeviceData);
	}

	onChange(e) {
        const {id, value} = e.target;
        switch(id) {
            case 'domain':
                let currentDomain = this.state.domainList.options[e.target.selectedIndex];
                this.setState({currentDomain}, this.initDeviceData);
				break;
        }
    }

    searchChange(value) {
        this.setState({
            search: {...this.state.search, value: value}
        })
    }

    searchSubmit() {
        this.initDeviceData(true);
    }

    collapseHandler() {
        this.setState({sidebarCollapse: !this.state.sidebarCollapse});
	}

	startDateChange(date, dateStr) {
		this.setState({startDate: date});
	}

	endDateChange(date, dateStr) {
		this.setState({endDate: date});
	}

	tableRowCheckChange(rowId, checked) {
		let {selectDevices, deviceList} = this.state;
		if(checked) {
			this.setState({selectDevices: [...selectDevices, ...deviceList.filter((item)=>item.id == rowId)]});
		} else {
			let _selectDevices = [...selectDevices];
			_selectDevices.splice(_selectDevices.findIndex((item) => item.id == rowId), 1);
			this.setState({selectDevices: _selectDevices });
		}
	}

	getChartData(cb) {
		const {deviceList, selectDevices, startDate, endDate} = this.state;
		console.log('get chart data');
		if(selectDevices.length == 0) {
			this.setState({chartData: []});
			cb && cb();
			return ;
		}
		let arr = []
		selectDevices
		.slice(0, this.maxNumofSelectDevices)
		.forEach(item => {
			arr.push(getHistoriesDataByAssetId({
				where: {
					asset: item.id,
					prop: 'brightness',
					timestamp: {
						between: [startDate, endDate]
					}
				}
			}))
		})
		Promise.all(arr)
			.then(ret => {
				let chartData = ret.map(item => {
					return {values: item};
				})
				this.setState({chartData}, cb && cb);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	onClick(e) {
		const {id} = e.target;
		const {search, domainList, currentDomain} = this.state;
		switch(id) {
			case 'apply':
				this.getChartData(this.updateLineChart);
				break;
			case 'reset':
				this.setState({
					selectDevices: [],
					chartData: [],
					startDate: getYesterday(),
					endDate: getToday(),
					search: {...search, value: ''},
					currentDomain: domainList.options[0]
				}, () => {
					this.initDeviceData();
					this.updateLineChart();
				});
				break;
		}
	}

	componentWillUnmount() {
		this.destroyLineChart();
	}

	drawLineChart(ref) {
		const {chartData, startDate, endDate} = this.state;
        this.chart = new Chart({
            wrapper: ref,
            data: chartData,
            xAccessor: d=> d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ")(d.timestamp),
			yAccessor: d => d.value,
			xDomain: [startDate, endDate],
			yDomain: [0, 100],
            curveFactory: d3.curveStepAfter,
            yTickFormat: d => {if(d == 0) return ''; return `${d}%`},
            tooltipAccessor: d => d.y
        });
	}

	updateLineChart() {
		const {chartData, startDate, endDate} = this.state;
        this.chart.updateChart(chartData, [startDate, endDate]);
	}

	destroyLineChart() {
        this.chart.destroy();
        this.chart = null;
	}

    render() {
        const {page: {total, current, limit}, sidebarCollapse,
				search: {value, placeholder}, currentDomain, domainList,
				deviceList, selectDevices, startDate, endDate, chartData } = this.state;

        return <Content className={`device-brightness ${sidebarCollapse ? 'collapse' : ''}`}>
					<div className="content-left">
						<ul className="select-device-list">
						{
							selectDevices.slice(0, this.maxNumofSelectDevices)
								.map((device, index) => <li key={device.id} className={`color-${index+1}`}>{device.name}</li>)
						}
						</ul>
						<div className='chart-container' ref={this.drawLineChart}></div>
                    </div>
                    <div className={`container-fluid sidebar-info ${sidebarCollapse ? "sidebar-collapse" : ""}`}>
                        <div className="row collapse-container" onClick={this.collapseHandler}>
                            <span className={sidebarCollapse ? "icon_horizontal"  :"icon_verital"}></span>
                        </div>
                        <div className="panel panel-default panel-1">
                            <div className="panel-heading">
								<svg><use xlinkHref={"#icon_device_operate"} transform="scale(0.088,0.086)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg>选择时间
                            </div>
							<div className="panel-body">
								<DatePicker className="start-date" placeholder="选择起始日期" value={startDate} allowClear={false} locale={'zh'} onChange={this.startDateChange}/>
								<span>至</span>
								<DatePicker className="start-date" placeholder="选择结束日期" value={endDate} allowClear={false} onChange={this.endDateChange}/>
                            </div>
                        </div>
                        <div className="panel panel-default panel-2">
							<div className="panel-heading">
								<svg><use xlinkHref={"#icon_sys_select"} transform="scale(0.08,0.08)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg>选择设备
                            </div>
							<div className="panel-body">
								<div className="device-filter">
									<Select id='domain' titleField={domainList.titleField} valueField={domainList.valueField} options={domainList.options}
                                		value={currentDomain == null ? '' : currentDomain[this.state.domainList.valueField]} onChange={this.onChange} />
									<SearchText placeholder={placeholder} value={value} onChange={this.searchChange} submit={this.searchSubmit} />
								</div>

								<Table columns={this.columns} data={Immutable.fromJS(deviceList)} allChecked={false} rowCheckChange={this.tableRowCheckChange}/>
								<div className="page-center">
									<Page className={`page ${total==0?"hidden":''}`} showSizeChanger pageSize={limit}
											current={current} total={total} onChange={this.pageChange}/>
								</div>
								<div className="btn-group-right">
									<button id="reset" className="btn btn-reset" onClick={this.onClick}>重置</button>
									<button id="apply" className="btn btn-primary" onClick={this.onClick}>应用</button>
								</div>
                            </div>
                        </div>
                    </div>
                </Content>
    }
}
