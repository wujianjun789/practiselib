/**
 * Created by a on 2017/8/14.
 */
import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Content from '../../components/Content';
import SearchText from '../../components/SearchText';
import Table from '../../components/Table';
import {overlayerHide, overlayerShow} from '../../common/actions/overlayer';
import SensorStrategyPopup from '../component/SensorStrategyPopup';
import ConfirmPopup from '../../components/ConfirmPopup';
import Page from '../../components/Page';
import Immutable from 'immutable';
import {getStrategyListByName, getStrategyCountByName, delStrategy, getModelSummariesByModelID} from '../../api/strategy';
import {getObjectByKeyObj} from '../../util/algorithm';

export class SensorStrategy extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: [],
            search: {
                placeholder: '输入策略名称',
                value: ''
            },
            page: {
                pageSize: 10,
                current: 1,
                total: 0
            },
            sensorTypeList: {
                titleField: 'title',
                valueField: 'value',
                options: []
            },
            sensorsProps: {}
        };

        this.sensorTransform = {
            noise: 'SENSOR_NOISE',
            PM25: 'SENSOR_PM25',
            pa: 'SENSOR_PA',
            humis: "SENSOR_HUMIS",
            temps: 'SENSOR_TEMPS',
            windSpeed: 'SENSOR_WINDS',
            windDir: 'SENSOR_WINDDIR',
            co: 'SENSOR_CO',
            o2: 'SENSOR_O2',
            ch4: 'SENSOR_CH4',
            ch2o: 'SENSOR_CH2O'
        }

        this.columns = [
            {field: 'name', title: '策略名称'},
            {field: 'sensorType', title: '传感器类型'}
        ];

        this.searchChange = this.searchChange.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.addStrategy = this.addStrategy.bind(this);
        this.tableRowEdit = this.tableRowEdit.bind(this);
        this.tableRowDelete = this.tableRowDelete.bind(this);
        this.pageChange = this.pageChange.bind(this);

        this.initData = this.initData.bind(this);
        this.updateSensorStrategyList = this.updateSensorStrategyList.bind(this);
        this.updatePageData = this.updatePageData.bind(this);
        this.updateSensorTypeList = this.updateSensorTypeList.bind(this);
        this.generateSensorTypesData = this.generateSensorTypesData.bind(this);

        this.getSensorTypeFromStrategy = this.getSensorTypeFromStrategy.bind(this);
        
    }

    componentWillMount() {
        this.mounted = true;
        this.initData();
        getModelSummariesByModelID('sensor', this.updateSensorTypeList);
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    updateSensorTypeList(data) {
        if('types' in data) {
            const {types, defaults} = data;
            const options = this.generateSensorTypesData(types);
            this.setState({sensorTypeList: Object.assign({}, this.state.sensorTypeList, {options: options})});

            let sensorType = types.length == 0 ? '' : types[0];
            if(this.props.popupId == 'add') {
                this.setState({data: Object.assign({}, this.state.data, {sensorType})});
            }

            let sensorsProps = Object.assign({}, defaults.values);
            this.setState({sensorsProps});
        }
        
    }

    generateSensorTypesData(types) {
        let list = [];
        const sensorTitles = {
            SENSOR_NOISE: '噪声传感器',
            SENSOR_PM25: 'PM2.5 传感器',
            SENSOR_PA: '大气压传感器',
            SENSOR_HUMIS: '湿度传感器',
            SENSOR_TEMPS: '温度传感器',
            SENSOR_WINDS: '风速传感器',
            SENSOR_WINDDIR: '风向传感器',
            SENSOR_CO: '一氧化碳传感器',
            SENSOR_O2: '氧气传感器',
            SENSOR_CH4: '甲烷传感器',
            SENSOR_CH2O: '甲醛传感器'
        }
        types.forEach(val => {
            list.push({value: val, title: sensorTitles[val]});
        });
        return list;
    }

    searchChange(value) {
        this.setState({search: Object.assign({}, this.state.search, {value})});
    }

    searchSubmit() {
        this.initData(true);
    }

    tableRowEdit(id) {
        const data = getObjectByKeyObj(this.state.data, 'id', id);
        const initData = {
            id: id,
            strategyName: data.name,
            sensorType: this.getSensorTypeFromStrategy(data),
            controlDevice: data.asset,
            sensorParamsList: data.strategy
        };
        this.props.actions.overlayerShow(<SensorStrategyPopup className='sensor-strategy-popup' popupId='edit' title="修改策略" data={initData}
            sensorTypeList={this.state.sensorTypeList} sensorsProps={this.state.sensorsProps}
            overlayerHide={this.props.actions.overlayerHide} updateSensorStrategyList={this.initData}/>);
    }

    tableRowDelete(id) {
        this.props.actions.overlayerShow(<ConfirmPopup tips="是否删除选中策略？" iconClass="icon_popup_delete"
            cancel={ this.props.actions.overlayerHide } confirm={ () => {
                delStrategy(id,()=>{
                    this.props.actions.overlayerHide && this.props.actions.overlayerHide();
                    this.initData();
                })
        } }/>);
    }

    getSensorTypeFromStrategy(data) {
        return this.sensorTransform[Object.keys(data.strategy[0]&&data.strategy[0].condition)[0]];
    }

    pageChange(page) {
        this.setState({page: Object.assign({}, this.state.page, {current: page})}, this.initData);
    }

    addStrategy(e) {
        const {id} = e.target;
        const initData = {
            id: '',
            sensorType: this.state.sensorTypeList.options[0]&&this.state.sensorTypeList.options[0][this.state.sensorTypeList.valueField],
        };
        id=='add-sensor' && this.props.actions.overlayerShow(<SensorStrategyPopup className='sensor-strategy-popup' popupId='add' title="新建策略" data={initData}
            sensorTypeList={this.state.sensorTypeList} sensorsProps={this.state.sensorsProps}
            overlayerHide={this.props.actions.overlayerHide} updateSensorStrategyList={this.initData}/>);
    }

    initData(isSearch) {
        const {search: {value}, page} = this.state;
        if(isSearch){
            page.current = 1;
            this.setState({page:page});
        }

        const {pageSize, current} = this.state.page;
        const offset = pageSize * ( current - 1 );
        getStrategyListByName('sensor', value, offset, pageSize, this.mounted&&this.updateSensorStrategyList );
        getStrategyCountByName('sensor', value, this.mounted&&this.updatePageData );
    }

    updateSensorStrategyList(data) {
        if(data.length!=0) {
            data = data.map(item => {
                item.sensorType = this.getSensorTypeFromStrategy(data[0]);
                return item;
            });
        }
        this.setState({data: data});
    }

    updatePageData(data) {
        this.setState({page: Object.assign({}, this.state.page, {total: data.count})});
    }

    render() {
        const {data, search, page} = this.state;
        return <Content className="sensor-strategy">
            <div className="content-title">
                <SearchText placeholder={search.placeholder} value={search.value} onChange={this.searchChange} submit={this.searchSubmit}/>
                <button id="add-sensor" className="btn btn-primary" onClick={this.addStrategy}>添加</button>
            </div>
            <div className="content-body">
                <Table columns={this.columns} keyField='id' data={Immutable.fromJS(data)} isEdit rowEdit={this.tableRowEdit} rowDelete={this.tableRowDelete} />
                <div className='pagination'><Page className={`${page.total==0?"hidden":''}`} showSizeChanger pageSize={page.pageSize} current={page.current} total={page.total} onChange={this.pageChange}/></div>
            </div>
        </Content>
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            overlayerHide,
            overlayerShow
        }, dispatch)
    }
}

export default connect(null, mapDispatchToProps)(SensorStrategy);