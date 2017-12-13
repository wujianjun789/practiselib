/**
 * Created by a on 2017/8/14.
 */
import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {injectIntl} from 'react-intl';

import Content from '../../components/Content';
import SearchText from '../../components/SearchText';
import Table from '../../components/Table';
import {overlayerHide, overlayerShow} from '../../common/actions/overlayer';
import SensorStrategyPopup from '../component/SensorStrategyPopup';
import ConfirmPopup from '../../components/ConfirmPopup';
import Page from '../../components/Page';
import Immutable from 'immutable';
import {getStrategyListByName, getStrategyCountByName, delStrategy} from '../../api/strategy';
import {getModelSummariesByModelID} from '../../api/asset';
import {getLightLevelConfig, getStrategyDeviceConfig} from '../../util/network';
import {getObjectByKeyObj} from '../../util/algorithm';
import {addNotify} from '../../common/actions/notifyPopup';

export class SensorStrategy extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: [],
            search: {
                placeholder: this.formatIntl('app.input.strategy.name'),
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
            sensorsProps: {},
            controlDeviceList: {
                titleField: 'title',
                valueField: 'value',
                options: [
                    {value: 'screen', title: this.formatIntl('app.screen')},
                    {value: 'lc', title: this.formatIntl('app.lamp')}
                ]
            },
            brightnessList: {
                titleField: 'title',
                valueField: 'value',
                options: []
            }
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
            {field: 'name', title: this.formatIntl('app.strategy.name')},
            {field: 'sensorType', title: this.formatIntl('app.sensor.type')}
        ];

        this.searchChange = this.searchChange.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.addStrategy = this.addStrategy.bind(this);
        this.tableRowEdit = this.tableRowEdit.bind(this);
        this.tableRowDelete = this.tableRowDelete.bind(this);
        this.pageChange = this.pageChange.bind(this);

        this.initData = this.initData.bind(this);
        this.updateSensorStrategyList = this.updateSensorStrategyList.bind(this);
        this.updateControlDeviceList = this.updateControlDeviceList.bind(this);
        this.updateBrightnessList = this.updateBrightnessList.bind(this);
        this.updatePageData = this.updatePageData.bind(this);
        this.updateSensorTypeList = this.updateSensorTypeList.bind(this);
        this.generateSensorTypesData = this.generateSensorTypesData.bind(this);

        this.getSensorTypeFromStrategy = this.getSensorTypeFromStrategy.bind(this);
        this.formatIntl = this.formatIntl.bind(this);
    }

    componentWillMount() {
        this.mounted = true;
        this.initData();
        getModelSummariesByModelID('sensor', this.updateSensorTypeList);
        getStrategyDeviceConfig(this.updateControlDeviceList);
        getLightLevelConfig(this.updateBrightnessList);
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    formatIntl(formatId){
        return this.props.intl.formatMessage({id:formatId});
        // return formatId;
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

    updateControlDeviceList(data) {
        // ["lc", "screen"]
        let opt = [];
        data.forEach(value => {
            let title = '';
            if(value == 'lc') {
                title = this.formatIntl('app.lamp');
            } else if (value == 'screen') {
                title = this.formatIntl('app.screen');
            }
            opt.push({title, value});
        })
        this.setState({controlDeviceList: Object.assign({}, this.state.controlDeviceList, {options: opt} )});
    }

    updateBrightnessList(data) {
        // ["关", 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
        let opt = [];
        data.forEach(value => {
            let val = value;
            let title = `${this.formatIntl('app.brightness')}' '${val}`;
            if(value == '关') {
                val = 'off';
                title = this.formatIntl('app.close');
            }
            opt.push({value: val, title});
        });
        this.setState({brightnessList: Object.assign({}, this.state.brightnessList, {options: opt})});
    }

    generateSensorTypesData(types) {
        let list = [];
        const sensorTitles = {
            SENSOR_NOISE: this.formatIntl('app.sensor.noise'),
            SENSOR_PM25: this.formatIntl('app.sensor.pm25'),
            SENSOR_PA: this.formatIntl('app.sensor.pa'),
            SENSOR_HUMIS: this.formatIntl('app.sensor.humis'),
            SENSOR_TEMPS: this.formatIntl('app.sensor.temps'),
            SENSOR_WINDS: this.formatIntl('app.sensor.winds'),
            SENSOR_WINDDIR: this.formatIntl('app.sensor.winddir'),
            SENSOR_CO: this.formatIntl('app.sensor.co'),
            SENSOR_O2: this.formatIntl('app.sensor.o2'),
            SENSOR_CH4: this.formatIntl('app.sensor.ch4'),
            SENSOR_CH2O: this.formatIntl('app.sensor.ch2o'),
            SENSOR_LX: this.formatIntl('app.sensor.lx')
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
        this.props.actions.overlayerShow(<SensorStrategyPopup intl={this.props.intl} className='sensor-strategy-popup' popupId='edit' title={this.formatIntl('app.edit.strategy')} data={initData}
            sensorTypeList={this.state.sensorTypeList} sensorsProps={this.state.sensorsProps}
            controlDeviceList={this.state.controlDeviceList} brightnessList={this.state.brightnessList}
            overlayerHide={this.props.actions.overlayerHide} updateSensorStrategyList={this.initData}
            addNotify={this.props.actions.addNotify} />);
    }

    tableRowDelete(id) {
        this.props.actions.overlayerShow(<ConfirmPopup tips={this.formatIntl('delete.strategy')} iconClass="icon_popup_delete"
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
        id=='add-sensor' && this.props.actions.overlayerShow(<SensorStrategyPopup intl={this.props.intl} className='sensor-strategy-popup' popupId='add' title={this.formatIntl('app.add.strategy')} data={initData}
            sensorTypeList={this.state.sensorTypeList} sensorsProps={this.state.sensorsProps}
            controlDeviceList={this.state.controlDeviceList} brightnessList={this.state.brightnessList}
            overlayerHide={this.props.actions.overlayerHide} updateSensorStrategyList={this.initData}
            addNotify={this.props.actions.addNotify} />);
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
                <button id="add-sensor" className="btn btn-primary" onClick={this.addStrategy}>{this.formatIntl('button.add')}</button>
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
            addNotify,
            overlayerHide,
            overlayerShow
        }, dispatch)
    }
}

export default connect(null, mapDispatchToProps)(injectIntl(SensorStrategy));
