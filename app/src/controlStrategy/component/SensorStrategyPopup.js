import React, {Component} from 'react';
import Panel from '../../components/Panel';
import PanelFooter from '../../components/PanelFooter';
import Select from '../../components/Select.1';
import LineChart from '../util/LineChart';
import PropTypes from 'prop-types';
import {NameValid, numbersValid} from '../../util/index';
import {getModelSummariesByModelID, addStrategy, updateStrategy} from '../../api/strategy';

let options = (function generateLampLightnessList() {
    let opt = [];
    for(let i=0; i<11; i++){
        let val = i*10;
        opt.push({value: val, title: `亮度${val}`});
    }
    opt.unshift({value: 'off', title: '关'});
    // opt.unshift({value: '', title: '选择灯亮度'});
    return opt;
})();

export default class SensorStrategyPopup extends Component {
    constructor(props) {
        super(props);
        const {id, strategyName, sensorType='', controlDevice='lc', screenSwitch='off', sensorParam='', brightness='off', sensorParamsList=[]} = this.props.data;
        this.state = {
            chart: null,
            data: {
                id,
                strategyName,
                sensorType,
                controlDevice,
                screenSwitch,
                sensorParam,
                brightness
            },
            controlDeviceList: {
                titleField: 'title',
                valueField: 'value',
                options: [
                    {value: 'screen', title: '屏幕'},
                    {value: 'lc', title: '灯'}
                ]
            },
            brightnessList: {
                titleField: 'title',
                valueField: 'value',
                options: options
            },
            screenSwitchList: {
                titleField: 'title',
                valueField: 'value',
                options: [
                    // {value: '', title: '选择屏幕开关'},
                    {value: 'on', title: '屏幕开'},
                    {value: 'off', title: '屏幕关'}
                ]
            },

            sensorParamsList: sensorParamsList,
            checkStatus: {
                strategyName: false,
                sensorType: false,
                controlDevice: false,
                sensorParam: false,
                brightness: false,
                screenSwitch: false
            }
        };

        this.sensorTransform = {
            SENSOR_NOISE: 'noise',
            SENSOR_PM25: 'PM25',
            SENSOR_PA: 'pa',
            SENSOR_HUMIS: 'humis',
            SENSOR_TEMPS: 'temps',
            SENSOR_WINDS: 'windSpeed',
            SENSOR_WINDDIR: 'windDir',
            SENSOR_CO: 'co',
            SENSOR_O2: 'o2',
            SENSOR_CH4: 'ch4',
            SENSOR_CH2O: 'ch2o'
        }

        this.onChange = this.onChange.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.sensorParamDelete = this.sensorParamDelete.bind(this);
        this.drawLineChart = this.drawLineChart.bind(this);
        this.addSensorParam = this.addSensorParam.bind(this);
        this.updateLineChart = this.updateLineChart.bind(this);
        this.destroyLineChart = this.destroyLineChart.bind(this);

        this.addStrategy = this.addStrategy.bind(this);
        this.updateStrategy = this.updateStrategy.bind(this);
    }

    onChange(e) {
        const {id, value} = e.target;
        if((id == 'screenSwitch' || id == 'sensorType' || id == 'brightness') && value === '' ) {
            this.setState({checkStatus: Object.assign({}, this.state.checkStatus, {[id]: true})});
            return ;
        }
        switch(id) {
            case 'strategyName':
                let status = !NameValid(value);
                this.setState({
                    data: Object.assign({}, this.state.data, {strategyName: value}),
                    checkStatus: Object.assign({}, this.state.checkStatus, {strategyName: status})
                });
                break;
            case 'sensorType':
            case 'controlDevice':
                this.setState({data: Object.assign({}, this.state.data, {[id]: value})});
                break;
            case 'sensorParam':
                let val = value;
                if(!numbersValid(value)) {
                    val = 0;
                }
                this.setState({
                    data: Object.assign({}, this.state.data, {sensorParam: val})
                });
                break;
            case 'screenSwitch':
            case 'brightness':
                this.setState({data: Object.assign({}, this.state.data, {[id]: value})});
                break;
        }
    }

    sensorParamDelete(e) {
        const index = e.target.id;
        let sensorParamsList = Object.assign([], this.state.sensorParamsList);
        sensorParamsList.splice(index,1);
        this.setState({sensorParamsList}, ()=>{
            this.updateLineChart();
        });
    }

    drawLineChart(ref) {
        let chart = new LineChart({
            wrapper: ref,
            data: {values: this.state.sensorParamsList},
            xAccessor: d=>d.condition[ this.sensorTransform[this.state.data.sensorType] ],
            yAccessor: d => {
                if (d.rpc.value=='off') {
                    return 0;
                } else if (d.rpc.value=='on') {
                    return 1;
                } else {
                    return d.rpc.value;
                }
            },
            curveFactory: d3.curveStepAfter,
            tickFormat: d => `${d}${this.props.sensorsProps[this.state.data.sensorType]?this.props.sensorsProps[this.state.data.sensorType].unit:''}`,
            padding: {left: 0, top: 35, right: 0, bottom: 20},
            tooltipAccessor: d => d.rpc.title
        });
        this.setState({chart: chart});
    }

    updateLineChart() {
        this.state.chart.updateChart({values: this.state.sensorParamsList});
    }

    destroyLineChart() {
        this.state.chart.destroy();
        this.setState({chart: null});
    }

    addSensorParam() {
        const {sensorParam, brightness, screenSwitch, controlDevice, sensorType} = this.state.data;
        let value = '';
        let title = '';
        if(controlDevice=='lc') {
            value = brightness;
            if(value == 'off') {
                title = '关';
            } else {
                title = `亮度${value}`;
            }
        } else {
            value = screenSwitch;
            title = value == 'off'?'屏幕关':'屏幕开';
        }
        const data = {value: value, title: title};
        let sensorParamsList = Object.assign([], this.state.sensorParamsList);
        sensorParamsList.push({condition: {[ this.sensorTransform[sensorType] ]: sensorParam}, rpc: data});
        this.setState({sensorParamsList, data: Object.assign({}, this.state.data, {sensorParam: ''})}, () => {
            this.updateLineChart();
        });
    }

    onCancel() {
        this.props.overlayerHide && this.props.overlayerHide();
    }

    onConfirm() {
        if(this.props.popupId == 'add') {
            this.addStrategy();
        } else {
            this.updateStrategy();
        }
    }

    updateStrategy() {
        const {data,sensorParamsList} = this.state;
        let _data = {
            id: data.id,
            name: data.strategyName,
            type: 'sensor',
            asset: data.controlDevice,
            expire : {
              expireRange: [],
              executionRange: [],
              week: 0,
            },
            strategy: sensorParamsList
        };
        updateStrategy(_data, ()=>{
            this.props.overlayerHide && this.props.overlayerHide();
            this.props.updateSensorStrategyList();
        });
    }

    addStrategy() {
        const {data,sensorParamsList} = this.state;
        let _data = {
            name: data.strategyName,
            type: 'sensor',
            asset: data.controlDevice,
            expire : {
              expireRange: [],
              executionRange: [],
              week: 0,
            },
            strategy: sensorParamsList
        };
        addStrategy(_data, ()=>{
            this.props.overlayerHide && this.props.overlayerHide();
            this.props.updateSensorStrategyList();
        });
    }

    componentWillUnmount() {
        this.destroyLineChart();
    }

    render() {
        const {controlDeviceList, screenSwitchList, brightnessList, sensorParamsList, data, checkStatus} = this.state;
        const {sensorTypeList, sensorsProps} = this.props;
        const {className, title} = this.props;
        const footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['取消','确认']}
                                  btnClassName={['btn-default', 'btn-primary']} btnDisabled={[false, false]}
                                  onCancel={this.onCancel} onConfirm={this.onConfirm}/>;
        return (
            <Panel className={className} title={title} footer={footer} closeBtn={true} closeClick={this.onCancel}>
                <div className="form-group">
                    <label htmlFor="strategyName" className="control-label">策略名称：</label>
                    <div className="form-group-right">
                        <input type="text" className="form-control" id="strategyName" placeholder="传感器使用策略" value={data.strategyName}
                            onChange={this.onChange}/>
                        <span style={{visibility: checkStatus.strategyName ? 'visible' : 'hidden'}}>策略名已使用/仅能使用数字、字母、下划线</span>
                    </div>
                </div>
                <div className="inline-group">
                    <div className="form-group">
                        <label htmlFor="sensorType" className="control-label">传感器类型：</label>
                        <div className="form-group-right">
                            <Select id="sensorType" className="form-control" titleField={sensorTypeList.titleField}
                                    valueField={sensorTypeList.valueField} options={sensorTypeList.options} value={data.sensorType}
                                    onChange={this.onChange}/>
                            <span style={{visibility: checkStatus.sensorType ? 'visible' : 'hidden'}}>请选择传感器</span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="controlDevice" className="control-label">控制设备：</label>
                        <div className="form-group-right">
                            <Select id="controlDevice" className="form-control" titleField={controlDeviceList.titleField}
                                    valueField={controlDeviceList.valueField} options={controlDeviceList.options} value={data.controlDevice}
                                    onChange={this.onChange}/>
                            <span style={{visibility: checkStatus.controlDevice ? 'visible' : 'hidden'}}>请选择设备</span>
                        </div>
                    </div>
                </div>
                <div className="form-group chart">
                    <label className="control-label">图表：</label>
                    <div className="form-group-right" ref={this.drawLineChart}></div>
                </div>
                <div className="form-group">
                    <label className="control-label">设置参数：</label>
                    <div className="form-group-right lightness">
                        <button className="btn btn-primary" onClick={this.addSensorParam}>添加节点</button>
                        <div className="lightness-right">
                            <div>
                                <input id="sensorParam" type='text' className="form-control" placeholder="输入传感器参数" value={data.sensorParam} onChange={this.onChange}/>
                                {
                                    data.controlDevice != 'lc' ?
                                    <Select id="screenSwitch" className="form-control" titleField={screenSwitchList.titleField}
                                        valueField={screenSwitchList.valueField} options={screenSwitchList.options} value={data.screenSwitch}
                                        onChange={this.onChange}/>
                                    :
                                    <Select id="brightness" className="form-control" titleField={brightnessList.titleField}
                                        valueField={brightnessList.valueField} options={brightnessList.options} value={data.brightness}
                                        onChange={this.onChange}/>
                                }
                            </div>
                            <ul>
                            {
                                sensorParamsList.map((item, index) => <li key={index}><span className="sensor-param">{`${item.condition[ this.sensorTransform[data.sensorType] ]} ${sensorsProps[data.sensorType]?sensorsProps[data.sensorType].unit:''}`}</span><span className="sensor-other">{item.rpc.title}</span><span id={index} className="glyphicon glyphicon-trash" onClick={this.sensorParamDelete}></span></li>)
                            }
                            </ul>
                        </div>
                    </div>
                </div>
            </Panel>
        )
    }
}
