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
import {getDomainList} from '../../../api/domain';
import {getSearchAssets, getSearchCount} from '../../../api/asset';

export default class Brightness extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            page: {
                total: 0,
                current: 1,
                limit: 8
            },
            search: {
                value: '',
                placeholder: '请输入设备名称',

            },
			sidebarCollapse: false,
			currentDomain: null,
            domainList: {
                titleField: 'name',
                valueField: 'name',
                options: []
			},
			deviceList: [],
			selectDevice: []
		};

		this.columns = [
			{accessor: 'name', title: '设备名称'},
			{accessor: 'domain', title: '域'},
			{accessor: 'id', title: '设备编号'},
		];

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
            options = data;
        if (data.length == 0) {
            currentDomain = null;
        } else {
            currentDomain = data[0];
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

    render() {
        const {page: {total, current, limit}, sidebarCollapse,
                search: {value, placeholder}, currentDomain, domainList, deviceList } = this.state;

        return <Content className={`device-brightness ${sidebarCollapse ? 'collapse' : ''}`}>
					<div className="content-left">
						<div className="wrap">
							<ul className="select-device-list">
								<li className="color-1">灯集中控制器1</li>
								<li className="color-2">灯集中控制器2</li>
								<li className="color-3">灯集中控制器3</li>
								<li className="color-4">灯集中控制器4</li>
								<li className="color-5">灯集中控制器5</li>
							</ul>
							<div>
								chart chart
							</div>
						</div>
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
								<input type="text" className="form-control from" placeholder="选择起始日期" />
								<span>至</span>
								<input type="text" className="form-control to" placeholder="选择结束日期" />
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
								<Table columns={this.columns} data={deviceList} allChecked={false} />
								<div className="page-center">
									<Page className={`page ${total==0?"hidden":''}`} showSizeChanger pageSize={limit}
											current={current} total={total} onChange={this.pageChange}/>
								</div>
								<div className="btn-group-right">
									<button id="reset" className="btn btn-default">重置</button>
									<button id="apply" className="btn btn-primary">应用</button>
								</div>
                            </div>
                        </div>
                    </div>
                </Content>
    }
}
