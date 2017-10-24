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

export default class Power extends PureComponent {
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
			selectDeviceIds: [],
			selectDevices: {},
		};

		this.chart = null;
		this.model = 'lc';
		this.prop = 'power';
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
                this.setState({currentDomain, selectDeviceIds: [], selectDevices: {}}, this.initDeviceData);
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
		let {selectDevices, deviceList, selectDeviceIds} = this.state;
		if(checked) {
			if(selectDeviceIds.length < this.maxNumofSelectDevices) {
				this.setState({selectDeviceIds: [...selectDeviceIds, rowId], selectDevices: {...selectDevices, [rowId]: deviceList.find(item=>item.id == rowId)} });
			}
		} else {
			let _selectDevices = {...selectDevices};
			let _selectDeviceIds = [...selectDeviceIds];
			delete _selectDevices[rowId];
			_selectDeviceIds.splice(_selectDeviceIds.findIndex(item => item == rowId), 1);
			this.setState({selectDevices: _selectDevices, selectDeviceIds: _selectDeviceIds });
		}
	}

	getChartData(cb) {
		const {selectDeviceIds, selectDevices, startDate, endDate} = this.state;
		if(selectDeviceIds.length == 0) {
			this.setState({selectDevices: {}});
			cb && cb();
			return ;
		}
		let arr = [];
		selectDeviceIds
			.forEach(id => {
				arr.push(getHistoriesDataByAssetId({
					where: {
						asset: id,
						prop: this.prop,
						timestamp: {
							between: [startDate, endDate]
						}
					}
				}))
			});
		Promise.all(arr)
			.then(ret => {
				let _selectDevices = {...selectDevices};
				selectDeviceIds.forEach((id, index) => {
					_selectDevices[id].values = ret[index];
				});
				this.setState({selectDevices: _selectDevices}, cb);
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
				return ;
			case 'reset':
				this.setState({
					selectDevices: {},
					selectDeviceIds: [],
					startDate: getYesterday(),
					endDate: getToday(),
					search: {...search, value: ''},
					currentDomain: domainList.options[0]
				}, () => {
					this.initDeviceData();
					this.updateLineChart();
				});
				return ;
		}
	}

	componentWillUnmount() {
		this.destroyLineChart();
	}

	drawLineChart(ref) {
		const {selectDevices, startDate, endDate} = this.state;
        this.chart = new Chart({
            wrapper: ref,
            data: selectDevices,
            xAccessor: d=> d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ")(d.timestamp),
			yAccessor: d => d.value,
			xDomain: [startDate, endDate],
			yDomain: [0, 100],
            curveFactory: d3.curveStepAfter,
            yTickFormat: d => {if(d == 0) return ''; return `${d}W`},
            tooltipAccessor: d => d.y
        });
	}

	updateLineChart() {
		const {selectDevices, startDate, endDate} = this.state;
        this.chart.updateChart(Object.values(selectDevices), [startDate, endDate]);
	}

	destroyLineChart() {
        this.chart.destroy();
        this.chart = null;
	}

    render() {
        const {page: {total, current, limit}, sidebarCollapse,
				search: {value, placeholder}, currentDomain, domainList,
				deviceList, selectDevices, startDate, endDate, selectDeviceIds } = this.state;
        return <Content className={`device-amp ${sidebarCollapse ? 'collapse' : ''}`}>
					<div className="content-left">
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

								<Table columns={this.columns} data={Immutable.fromJS(deviceList)} allChecked={false} checked={selectDeviceIds} rowCheckChange={this.tableRowCheckChange}/>
								<div className={`page-center ${total==0?"hidden":''}`}>
									<Page className='page' showSizeChanger pageSize={limit}
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
