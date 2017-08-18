import React, {Component} from 'react';
import Panel from '../../components/Panel';
import PanelFooter from '../../components/PanelFooter';
import Select from '../../components/Select.1';
import PropTypes from 'prop-types';

let options = (function generateLampLightnessList() {
    let options = [];
    for(let i=0; i<11; i++){
        let val = i*10;
        options.push({value: val, title: `亮度${val}`});
    }
    options.unshift({value: 'off', title: '关'});
    options.unshift({value: '', title: '选择灯亮度'});
    return options;
})();

export default class SensorStrategyPopup extends Component {
    constructor(props) {
        super(props);
        const {id, strategyName, sensorType='windy', controlDevice, screenSwitch, sensorParam, lightness} = this.props.data;
        this.state = {
            data: {
                id, strategyName, sensorType, controlDevice, screenSwitch, sensorParam, lightness
            },
            controlDeviceList: {
                titleField: 'title',
                valueField: 'value',
                options: [
                    {value: 'screen', title: '屏幕'},
                    {value: 'lamp', title: '灯'}
                ]
            },
            lampLightnessList: {
                titleField: 'title',
                valueField: 'value',
                options: options
            },
            screenSwitchList: {
                titleField: 'title',
                valueField: 'value',
                options: [
                    {value: '', title: '选择屏幕开关'},
                    {value: 'on', title: '屏幕开'},
                    {value: 'off', title: '屏幕关'}
                ]
            },
            sensorTypeList: {
                titleField: 'title',
                valueField: 'value',
                options: [
                    {value: 'windy', title: '风速传感器'},
                    {value: 'pm2', title: 'PM 2.5'}
                ]
            },
            sensorParamsList: [
                {id: 0, sensorParam: '5', operator: '关'},
                {id: 1, sensorParam: '10', operator: '亮度10'},
                {id: 2, sensorParam: '15', operator: '亮度20'},
                {id: 3, sensorParam: '20', operator: '亮度30'},
                {id: 4, sensorParam: '25', operator: '亮度40'}
            ],
            sensorsUnit: {
                windy: 'm/s',
                pm2: '',
            }
        }

        this.onChange = this.onChange.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.sensorParamDelete = this.sensorParamDelete.bind(this);

    }

    onChange(e) {
        const {id, value} = e.target;
        if((id == 'screenSwitch' || id == 'sensorType' || id == 'lampLightness') && value === '' )
            return ;
        switch(id) {
            case 'strategyName':
            case 'sensorType':
            case 'controlDevice':
            case 'sensorParam':
            case 'screenSwitch':
            case 'lampLightness':
                this.setState({data: Object.assign({}, this.state.data, {[id]: value})});
                break;
        }
    }

    onCancel() {
        this.props.overlayerHide && this.props.overlayerHide();
    }

    onConfirm() {
        this.props.overlayerHide && this.props.overlayerHide();
    }

    sensorParamDelete(id) {

    }

    render() {
        const {sensorTypeList, controlDeviceList, screenSwitchList, lampLightnessList, sensorParamsList, sensorsUnit, data} = this.state;
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
                        <span>策略名已使用/仅能使用数字、字母、下划线</span>
                    </div>
                </div>
                <div className="inline-group">
                    <div className="form-group">
                        <label htmlFor="sensorType" className="control-label">传感器类型：</label>
                        <div className="form-group-right">
                            <Select id="sensorType" className="form-control" titleField={sensorTypeList.titleField}
                                    valueField={sensorTypeList.valueField} options={sensorTypeList.options} value={data.sensorType}
                                    onChange={this.onChange}/>
                            <span>请选择传感器</span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="controlDevice" className="control-label">控制设备：</label>
                        <div className="form-group-right">
                            <Select id="controlDevice" className="form-control" titleField={controlDeviceList.titleField}
                                    valueField={controlDeviceList.valueField} options={controlDeviceList.options} value={data.controlDevice}
                                    onChange={this.onChange}/>
                            <span>请选择设备</span>
                        </div>
                    </div>
                </div>
                <div className="form-group chart">
                    <label className="control-label">图表：</label>
                    <div className="form-group-right">
                    </div>
                </div>
                <div className="form-group">
                    <label className="control-label">设置参数：</label>
                    <div className="form-group-right lightness">
                        <button className="btn btn-primary">添加节点</button>
                        <div className="lightness-right">
                            <div>
                                <input id="sensorParam" type='text' className="form-control" placeholder="输入传感器参数" value={data.sensorParam} onChange={this.onChange}/>
                                {
                                    data.controlDevice != 'lamp' ?
                                    <Select id="screenSwitch" className="form-control" titleField={screenSwitchList.titleField}
                                        valueField={screenSwitchList.valueField} options={screenSwitchList.options} value={data.screenSwitch}
                                        onChange={this.onChange}/>
                                    :
                                    <Select id="lampLightness" className="form-control" titleField={lampLightnessList.titleField}
                                        valueField={lampLightnessList.valueField} options={lampLightnessList.options} value={data.lampLightness}
                                        onChange={this.onChange}/>
                                }
                            </div>
                            <ul>
                            {
                                sensorParamsList.map((item, index) => <li key={item.id}><span className="sensor-param">{`${item.sensorParam} ${sensorsUnit[data.sensorType]?sensorsUnit[data.sensorType]:''}`}</span><span className="sensor-other">{item.operator}</span><span className="glyphicon glyphicon-trash" onClick={this.sensorParamDelete}></span></li>)
                            }
                            </ul>
                        </div>
                    </div>
                </div>
            </Panel>
        )
    }
}
