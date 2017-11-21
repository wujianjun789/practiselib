/**
 * Created by a on 2017/11/20.
 */
import React,{ PureComponent } from 'react';

import 'antd/lib/date-picker/style';
import 'antd/lib/checkbox/style';
import { DatePicker, Checkbox } from 'antd';

const CheckboxGroup = Checkbox.Group;

import moment from 'moment'

import { NameValid } from '../../util/index';
export default class PlayerPlan extends PureComponent{
    constructor(props){
        super(props);

        this.state = {
            //计划
            property:{
                plan: { key: "plan", title: "计划名称", placeholder: "请输入名称", value: "" },
                startDate: { key: "startDate", title: "开始日期", placeholder: "点击选择开始日期", value: () => { moment() } },
                endDate: { key: "endDate", title: "结束日期", placeholder: "点击选择结束日期", value: "" },
                startTime: { key: "startTime", title: "开始时间", placeholder: "点击选择开始时间", value: "" },
                endTime: { key: "endTime", title: "结束时间", placeholder: "点击选择结束时间", value: "" },
                week: {
                    key: "week", title: "工作日",
                    list: [{ label: "周一", value: 1 }, { label: "周二", value: 2 },
                        { label: "周三", value: 3 }, { label: "周四", value: 4 },
                        { label: "周五", value: 5 }, { label: "周六", value: 6 },
                        { label: "周日", value: 7 }],
                    value: [1, 2]
                },
                action: {
                    key: "action", title: "动作", list: [{ id: 1, name: '动作1' }, { id: 2, name: '动作2' }], index: 0, name: "动作1"
                },
                position: {
                    key: 'position', title: '坐标位置',
                    list: [{ id: 'left', name: '左' }, { id: 'center', name: '居中' }, { id: 'right', name: '右' },
                        { id: 'top', name: '上' }, { id: 'middle', name: '中' }, { id: 'bottom', name: '下' },],
                    id: 'left'
                },
                axisX: { key: "axisX", title: "X轴", placeholder: "输入X轴", value: "" },
                axisY: { key: "axisY", title: "Y轴", placeholder: "输入Y轴", value: "" },
                speed: { key: "speed", title: "速度", placeholder: "fps(1-100)", value: "" },
                repeat: { key: "repeat", title: "重复次数", placeholder: "1-255", value: "" },
                resTime: { key: "resTime", title: "停留时间", placeholder: "ms", value: "" },
                flicker: { key: "flicker", title: "闪烁次数", placeholder: "1-255", value: "" }
            },
            prompt:{
                //计划
                action: false, axisX: true, axisY: true, speed: true, repeat: true, resTime: true, flicker: true,
            }
        }

        this.onChange = this.onChange.bind(this);
        this.dateChange = this.dateChange.bind(this);
        this.planClick = this.planClick.bind(this)
    }

    planClick(id) {
        console.log(id);
        switch (id) {
            case "apply":
                break;
            case "reset":
                break;
        }
    }

    dateChange(id, value) {
        if (id == "week" || id == "cycleWeek") {
            console.log(value);
            this.setState({ property: Object.assign({}, this.state.property, { [id]: Object.assign({}, this.state.property[id], { value: value }) }) });
        } else {
            this.setState({ property: Object.assign({}, this.state.property, { [id]: Object.assign({}, this.state.property[id], { value: value }) }) });
        }
    }


    onChange(id, value) {
        console.log("id:", id);
        let prompt = false;

        const val = value.target.value;
        if (!NameValid(val)) {
            prompt = true;
        }

        this.setState({
            property: Object.assign({}, this.state.property, { [id]: Object.assign({}, this.state.property[id], { value: val }) }),
            prompt: Object.assign({}, this.state.prompt, { [id]: prompt })
        })

    }

    render(){
        const {property, prompt} = this.state;
        return <div className={"pro-container playerPlan "}>
            <div className="row">
                <div className="form-group plan">
                    <label className="control-label"
                           htmlFor={property.plan.key}>{property.plan.title}</label>
                    <div className="input-container">
                        <input type="text" className={"form-control "}
                               placeholder={property.plan.placeholder} maxLength="16"
                               value={property.plan.value}
                               onChange={event => this.onChange("plan", event)} />
                        <span className={prompt.plan ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="form-group startDate">
                    <label className="control-label"
                           htmlFor={property.startDate.key}>{property.startDate.title}</label>
                    <div className="input-container">
                        <DatePicker id="startDate" showTime format="YYYY-MM-DD" placeholder="点击选择开始日期"
                                    defaultValue={moment()} onChange={value => this.dateChange('startDate', value)} />
                        <div className={prompt.startDate ? "prompt " : "prompt hidden"}>{"请选择开始日期"}</div>
                    </div>
                </div>
                <div className="form-group endDate">
                    <label className="control-label"
                           htmlFor={property.endDate.key}>{property.endDate.title}</label>
                    <div className="input-container">
                        <DatePicker id="endDate" showTime format="YYYY-MM-DD" placeholder="点击选择结束日期"
                                    defaultValue={moment()} onChange={value => this.dateChange('endDate', value)} />
                        <div className={prompt.endDate ? "prompt " : "prompt hidden"}>{"请选择结束日期"}</div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="form-group startTime">
                    <label className="control-label"
                           htmlFor={property.startTime.key}>{property.startTime.title}</label>
                    <div className="input-container">
                        <DatePicker id="startTime" showTime format="HH:mm:ss" placeholder="点击选择开始时间"
                                    defaultValue={moment()} onChange={value => this.dateChange('startTime', value)} />
                        <div className={prompt.startTime ? "prompt " : "prompt hidden"}>{"请选择开始时间"}</div>
                    </div>
                </div>
                <div className="form-group endTime">
                    <label className="control-label"
                           htmlFor={property.endTime.key}>{property.endTime.title}</label>
                    <div className="input-container">
                        <DatePicker id="endTime" showTime format="HH:mm:ss" placeholder="点击选择结束时间"
                                    defaultValue={moment()} onChange={value => this.dateChange('endTime', value)} />
                        <div className={prompt.endTime ? "prompt " : "prompt hidden"}>{"请选择结束时间"}</div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="form-group week">
                    <label className="control-label"
                           htmlFor={property.week.key}>{property.week.title}</label>
                    <div className="input-container">
                        <CheckboxGroup id="startTime" options={property.week.list} defaultValue={property.week.value} onChange={value => this.dateChange('week', value)} />
                        <span className={"fixpos " + (prompt.week ? "prompt " : "prompt hidden")}>{"请选择工作日"}</span>
                        {/* {
                         property.week.list.map(item=>{
                         return <label>
                         <input type="checkbox" className="checkbox-inline" key={item.value}
                         checked = {item.value}
                         />{item.label}</label>
                         })
                         } */}
                        {/* <span className={prompt.week?"prompt ":"prompt hidden"}>{"请输入正确参数"}</span> */}
                    </div>
                </div>
            </div>
            <div className="row">
                <button className="btn btn-primary pull-right" onClick={() => this.planClick('apply')}>应用</button>
                <button className="btn btn-gray pull-right" onClick={()=>this.planClick('reset')}>重置</button>
            </div>
        </div>
    }
}