/**
 * Created by a on 2017/8/14.
 */
import React,{Component} from 'react'
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import Panel from '../../components/Panel';
import PanelFooter from '../../components/PanelFooter'
import Select from '../../components/Select'
import CustomDateInput from './CustomDateInput';

import {timeStrategy} from '../util/chart';
import {getMomentDate, momentDateFormat,getMomentUTC} from '../../util/time'

import {STRATEGY_NAME_LENGTH, Name2Valid} from '../../util/index'

import Immutable from 'immutable'
export default class TimeStrategyPopup extends Component{
    constructor(props){
        super(props);
        this.state = {
            name:"夏季路灯",
            deviceName:"灯",
            startTime:getMomentDate(),
            endTime:getMomentDate(),
            workTime:Immutable.fromJS([{id:1, name:"周一", active:true},{id:2, name:"周二", active:true}, {id:3, name:"周三", active:true},
                    {id:4, name:"周四",active:true},{id:5, name:"周五",active:true},{id:6, name:"周六", active:true},
                    {id:7, name:"周日", active:true}]),

            chartList:[],

            time:Immutable.fromJS({
                list:[
                    {id:1, value:"15:00"},{id:2, value:"16:00"},{id:3, value:"17:00"}
                ],
                placeholder:"选择时间节点",
                value:"15:00",
                index:0
            }),
            light:Immutable.fromJS({
                list:[
                    {id:1, value:"开"},{id:2, value:"关"},{id:3, value:"60"},{id:4, value:80}
                ],
                placeholder:"选择灯亮度",
                value:"开",
                index:0
            }),

            prompt:{
                name:false,
                workTime: false
            }
        }

        this.renderChart = this.renderChart.bind(this);

        this.onChange = this.onChange.bind(this);
        this.dateOnChange = this.dateOnChange.bind(this);
        this.checkOnChange = this.checkOnChange.bind(this);
        this.setLightOnChange = this.setLightOnChange.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.onCancel = this.onCancel.bind(this);

        this.workTimeValid = this.workTimeValid.bind(this);
    }

    componentWillMount(){
        this.workTimeValid();
    }

    workTimeValid(){
        let dayList = this.state.workTime;
        for(let i=0;i<dayList.size;i++){
            if(dayList.getIn([i, 'active'])){
                this.setState({prompt:Object.assign({}, this.state.prompt, {workTime:false})})
                return;
            }
        }

        this.setState({prompt:Object.assign({}, this.state.prompt, {workTime:true})});
    }

    onChange(event){
        let id = event.target.id;
        let value = event.target.value;
        let newValue;
        let prompt=false;
        if(id == "deviceName"){
            const {options, valueKey} = this.props.deviceList;
            value = options[event.target.selectedIndex][valueKey];
        }else if(id == "name"){
            prompt = !Name2Valid(value);
        }

        this.setState({[id]:value, prompt:Object.assign({}, this.state.prompt, {[id]:prompt})});
    }

    dateOnChange(id, date){
      this.setState({[id]:date});
    }

    checkOnChange(event){
        let index = event.target.id-1;
        this.setState({workTime:this.state.workTime.updateIn([index, 'active'],v=>event.target.checked)}, ()=>{
            this.workTimeValid();
        });
    }

    setLightOnChange(id, selectIndex){
        this.state[id] = this.state[id].update("index", v=>selectIndex);
        this.setState({[id]:this.state[id].update("value",v=>this.state[id].getIn(['list', selectIndex, 'value']))})
    }

    onConfirm() {
        this.props.onConfirm && this.props.onConfirm(this.state);
    }

    onCancel() {
        this.props.onCancel() && this.props.onCancel();
    }

    renderChart(ref){
        if(ref){
            timeStrategy({id:ref.id, data:[{x: '1:00', y: 0}, {x: '3:00', y: 10}, {x: '5:00', y: 0}, {x: '7:00', y: 30},
                {x: '9:00', y: 0}, {x: '11:00', y: 0}, {x: '13:00', y: 0}, {x: '15:00', y: 0}, {x: '17:00', y: 0},
                {x: '19:00', y: 0}, {x: '21:00', y: 100}, {x: '24:00', y: 0}]});
        }
    }

    render(){
        const {name, deviceName, startTime, endTime, workTime, chartList, time, light, prompt} = this.state;
        const {deviceList, strategyList} = this.props;
        let {titleKey, valueKey, options} = deviceList;

        let valid = prompt.name || !options.length || prompt.workTime;
        let footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['取消','保存']}
                                  btnClassName={['btn-default', 'btn-primary']}
                                  btnDisabled={[false, valid]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>
        return <div className="time-strategy-popup">
            <Panel title={this.props.title} closeBtn={true} closeClick={this.onCancel} footer={footer}>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="form-group row">
                            <label className="col-sm-4 control-label" htmlFor="name">策略名称：</label>
                            <div className="col-sm-8">
                                <input type="text" className="form-control" id="name" placeholder="输入策略名称" maxLength={STRATEGY_NAME_LENGTH} value={name}
                                       onChange={this.onChange}/>
                                <span className={prompt.name?"prompt ":"prompt hidden"}>{"仅能使用字母、数字或下划线"}</span>
                            </div>

                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group row">
                            <label className="col-sm-4 control-label" htmlFor="deviceName">控制设备：</label>
                            <div className="col-sm-8">
                                <select className="form-control" id="deviceName" placeholder="选择设备" value={deviceName} onChange={this.onChange}>
                                    {
                                        options.map(item => <option key={item.id} value={item[valueKey]}>{item[titleKey]}</option>)
                                    }
                                </select>
                                <span className={options.length==0?"prompt ":"prompt hidden"}>{"仅能使用字母、数字或下划线"}</span>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="form-group row">
                            <label className="col-sm-4 control-label" htmlFor="startTime">日期范围：</label>
                            <div className="col-sm-8">
                                <DatePicker customInput={<CustomDateInput />} dateFormat="MM/DD" selected={startTime} onChange={date=>{this.dateOnChange("startTime", date)}}/>
                                <span className={false?"prompt ":"prompt hidden"}>{"请选择日期"}</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group row">
                            <label className="col-sm-4 control-label" htmlFor="startTime">至：</label>
                            <div className="col-sm-8">
                                <DatePicker customInput={<CustomDateInput />} dateFormat="MM/DD" selected={endTime} onChange={date=>{this.dateOnChange("endTime", date)}}/>
                                <span className={false?"prompt ":"prompt hidden"}>{"请选择日期"}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row work-day">
                    <div className="form-group row">
                        <label className="col-sm-3 control-label" htmlFor="startTime">工作日选择：</label>
                        <div className="col-sm-9">
                            <div className="">
                                {
                                    workTime.map(date=>{
                                        return <label key={date.get('id')} className="checkbox-inline" onChange={this.checkOnChange}>
                                            <input id={date.get('id')} type="checkbox" checked={date.get('active')}
                                            onChange={()=>{}}/>{date.get('name')}</label>
                                    })
                                }
                            </div>
                            <span className={prompt.workTime?"prompt ":"prompt hidden"}>{"请选择工作日"}</span>
                        </div>
                    </div>
                </div>
                <div className="row chart">
                    <div className="form-group row">
                        <label className="col-sm-3 control-label" htmlFor="startTime">图表：</label>
                        <div className="col-sm-9">
                            <div className="time-strategy-chart" id="timeStrategy" ref={this.renderChart}>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="row set-light">
                    <div className="form-group row">
                        <label className="col-sm-3 control-label" htmlFor="startTime">设置亮度：</label>
                        <div className="col-sm-9 right">
                            <div className="form-group row">
                                <button className="btn btn-default">添加节点</button>
                                <div className="col-sm-4 select-container">
                                    <Select className="form-control" data={time} onChange={selectIndex=>{this.setLightOnChange("time", selectIndex)}}></Select>
                                </div>
                                <div className="col-sm-4 select-container">
                                    <Select className="form-control" data={light} onChange={selectedIndex=>{this.setLightOnChange("light", selectedIndex)}}></Select>
                                </div>
                            </div>
                            <div className="row list-group">
                                {
                                    strategyList.map(strategy=>{
                                        return <div key={strategy.id} className="row">
                                            <span className="col-sm-5 time-point">{strategy.time}</span>
                                            <span className="col-sm-5 light">{strategy.light}</span>
                                            <span className="glyphicon icon icon-delete"></span>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </Panel>
        </div>
    }
}

TimeStrategyPopup.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.shape({
        name: PropTypes.string.isRequired,
        deviceName: PropTypes.string.isRequired
    }).isRequired,
    deviceList: PropTypes.shape({
        titleKey: PropTypes.string.isRequired,
        valueKey: PropTypes.string.isRequired,
        options: PropTypes.array.isRequired
    }).isRequired,
    strategyList: PropTypes.array.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
}