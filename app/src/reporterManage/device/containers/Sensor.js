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
import Immutable from 'immutable';
import MultiLineChartWithZoomAndBrush from '../components/MultiLineChartWithZoomAndBrush';
import {getDomainList} from '../../../api/domain';
import {getSearchAssets, getSearchCount} from '../../../api/asset';
import {getMomentDate, momentDateFormat} from '../../../util/time';

const selectDevices = [
	{ id: 1, name: '灯集中控制器1', values: [{x: 1, y: 85},{x: 2, y: 75},{x: 3, y: 65},{x: 4, y: 55},{x: 5, y: 45},{x: 6, y: 35},{x: 7, y: 35},{x: 8, y: 35},{x: 9, y: 35},{x: 10, y: 35},{x: 11, y: 35}, {x: 12, y: 95}, {x: 13, y: 95}]},
	{ id: 2, name: '灯集中控制器2', values: [{x: 1, y: 86},{x: 2, y: 56},{x: 3, y: 16},{x: 4, y: 66},{x: 5, y: 26},{x: 6, y: 56},{x: 7, y: 25},{x: 8, y: 45},{x: 9, y: 85},{x: 10, y: 25},{x: 11, y: 35}, {x: 12, y: 36}, {x: 13, y: 36}]},
	{ id: 3, name: '灯集中控制器3', values: [{x: 1, y: 12},{x: 2, y: 21},{x: 3, y: 33},{x: 4, y: 36},{x: 5, y: 45},{x: 6, y: 54},{x: 7, y: 23},{x: 8, y: 54},{x: 9, y: 85},{x: 10, y: 75},{x: 11, y: 57}, {x: 12, y: 63}, {x: 13, y: 63}]},
	{ id: 4, name: '灯集中控制器4', values: [{x: 1, y: 21},{x: 2, y: 32},{x: 3, y: 43},{x: 4, y: 54},{x: 5, y: 16},{x: 6, y: 26},{x: 7, y: 46},{x: 8, y: 65},{x: 9, y: 75},{x: 10, y: 55},{x: 11, y: 35}, {x: 12, y: 86}, {x: 13, y: 86}]},
	{ id: 5, name: '灯集中控制器5', values: [{x: 1, y: 31},{x: 2, y: 42},{x: 3, y: 53},{x: 4, y: 64},{x: 5, y: 26},{x: 6, y: 36},{x: 7, y: 56},{x: 8, y: 55},{x: 9, y: 65},{x: 10, y: 65},{x: 11, y: 25}, {x: 12, y: 56}, {x: 13, y: 56}]},
	{ id: 6, name: '灯集中控制器6', values: [{x: 1, y: 41},{x: 2, y: 52},{x: 3, y: 63},{x: 4, y: 74},{x: 5, y: 36},{x: 6, y: 46},{x: 7, y: 65},{x: 8, y: 45},{x: 9, y: 55},{x: 10, y: 75},{x: 11, y: 15}, {x: 12, y: 76}, {x: 13, y: 76}]}
];
export default class Sensor extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
			startDate: null,
			endDate: null,
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
			selectDevices: /* [] */selectDevices
		};

		this.columns = [
			{accessor: 'name', title: '设备名称'},
			{accessor: 'id', title: '设备编号'},
		];

		this.maxNumofSelectDevices = 5;

        this.collapseHandler = this.collapseHandler.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.searchChange = this.searchChange.bind(this);
		this.searchSubmit = this.searchSubmit.bind(this);
		this.onChange = this.onChange.bind(this);

		this.initData = this.initData.bind(this);
		this.initDeviceData = this.initDeviceData.bind(this);
		this.updateDeviceData = this.updateDeviceData.bind(this);
		this.updateDomainData = this.updateDomainData.bind(this);
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
			case 'startDate':
			case 'endDate':

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

    render() {
        const {page: {total, current, limit}, sidebarCollapse,
				search: {value, placeholder}, currentDomain, domainList,
				deviceList, selectDevices, startDate, endDate } = this.state;
		const _selectDevices = selectDevices.slice(0, this.maxNumofSelectDevices);
		const _startDate = startDate == null ? '' : momentDateFormat(getMomentDate(startDate));
		const _endDate = endDate == null ? '' : momentDateFormat(getMomentDate(endDate));

        return <Content className={`device-sensor ${sidebarCollapse ? 'collapse' : ''}`}>
					<div className="content-left">
						<ul className="select-device-list">
						{
							_selectDevices
								.map((device, index) => <li key={device.id} className={`color-${index+1}`}>{device.name}</li>)
						}
						</ul>
						<MultiLineChartWithZoomAndBrush className='chart-container' data={_selectDevices} />
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
								<input type="text" id="startDate" className="form-control start-date" placeholder="选择起始日期" value={_startDate} onChange={this.onChange}/>
								<span>至</span>
								<input type="text" id="endDate" className="form-control end-date" placeholder="选择结束日期" value={_endDate} onChange={this.onChange}/>
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
									<Select id='sensor' titleField={domainList.titleField} valueField={domainList.valueField} options={domainList.options}
										value={currentDomain == null ? '' : currentDomain[this.state.domainList.valueField]} onChange={this.onChange} />
									<SearchText placeholder={placeholder} value={value} onChange={this.searchChange} submit={this.searchSubmit} />
								</div>

								<Table columns={this.columns} data={Immutable.fromJS(deviceList)} allChecked={false} />
								<div className="page-center">
									<Page className={`page ${total==0?"hidden":''}`} showSizeChanger pageSize={limit}
											current={current} total={total} onChange={this.pageChange}/>
								</div>
								<div className="btn-group-right">
									<button id="reset" className="btn btn-reset">重置</button>
									<button id="apply" className="btn btn-primary">应用</button>
								</div>
                            </div>
                        </div>
                    </div>
                </Content>
    }
}
