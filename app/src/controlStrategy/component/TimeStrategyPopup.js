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
import Immutable from 'immutable'
export default class TimeStrategyPopup extends Component{
    constructor(props){
        super(props);
        this.state = {
            name:"夏季路灯",
            deviceName:"灯",
            startTime:"",
            endTime:"",
            workTime:{
                list:[{id:1, name:"周一", active:false},{id:2, name:"周二", active:false}, {id:3, name:"周三", active:false},
                    {id:4, name:"周四",active:false},{id:5, name:"周五",active:false},{id:6, name:"周六", active:false},
                    {id:7, name:"周日", active:false}]
            },
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

            date:getMomentDate(),
            prompt:{
                name:false
            }
        }

        this.renderChart = this.renderChart.bind(this);

        this.onChange = this.onChange.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    onChange(data){
        console.log(data);
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
        const {name, deviceName, workTime, chartList, time, light, date} = this.state;
        const {deviceList, strategyList} = this.props;
        let {titleKey, valueKey, options} = deviceList;

        let valid = false;
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
                                <input type="text" className="form-control" id="name" placeholder="输入策略名称" maxLength="16" value={name}
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
                                <span className={prompt.name?"prompt ":"prompt hidden"}>{"仅能使用字母、数字或下划线"}</span>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="form-group row">
                            <label className="col-sm-4 control-label" htmlFor="startTime">日期范围：</label>
                            <div className="col-sm-8">
                                <DatePicker customInput={<CustomDateInput />} dateFormat="MM/DD" selected={date} onChange={this.onChange}/>
                                <span className={prompt.name?"prompt ":"prompt hidden"}>{"请选择日期"}</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group row">
                            <label className="col-sm-4 control-label" htmlFor="startTime">至：</label>
                            <div className="col-sm-8">
                                <DatePicker customInput={<CustomDateInput />} dateFormat="MM/DD" selected={date} onChange={this.onChange}/>
                                <span className={prompt.name?"prompt ":"prompt hidden"}>{"请选择日期"}</span>
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
                                    workTime.list.map(date=>{
                                        return <label key={date.id} className="checkbox-inline"><input type="checkbox"/>{date.name}</label>
                                    })
                                }
                            </div>
                            <span className={prompt.name?"prompt ":"prompt hidden"}>{"请选择工作日"}</span>
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
                                    <Select className="form-control" data={time} onChange={this.onChange}></Select>
                                </div>
                                <div className="col-sm-4 select-container">
                                    <Select className="form-control" data={light} onChange={this.onChange}></Select>
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