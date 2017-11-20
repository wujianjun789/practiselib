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
export default class CyclePlan extends PureComponent{
    constructor(props){
        super(props);

        this.state = {
            property: {
                //周期插播计划
                cycleName: { key: "cycleName", title: "计划名称", placeholder: '请输入名称', value: "" },
                cycleInterval: { key: "cycleInterval", title: "时间间隔", placeholder: '秒', value: "" },
                cyclePause: { key: "cyclePause", title: "暂停标志", list: [{ id: '1', name: '暂停' }, { id: '2', name: '不暂停' }], index: 0, name: "暂停" },
                cycleDate: { key: "cycleDate", title: "指定日期", appoint: false },
                cycleStartDate: { key: "cycleStartDate", title: "开始日期", placeholder: "点击选择开始日期", value: moment() },
                cycleEndDate: { key: "cycleEndDate", title: "结束日期", placeholder: "点击选择结束日期", value: moment() },
                cycleTime: { key: "cycleDate", title: "指定时间", appoint: false },
                cycleStartTime: { key: "cycleStartTime", title: "开始时间", placeholder: "点击选择开始时间", value: moment() },
                cycleEndTime: { key: "cycleEndTime", title: "结束时间", placeholder: "点击选择结束时间", value: moment() },
                cycleWeek: {
                    key: "cycleWeek", title: "工作日",
                    list: [{ label: "周一", value: 1 }, { label: "周二", value: 2 },
                        { label: "周三", value: 3 }, { label: "周四", value: 4 },
                        { label: "周五", value: 5 }, { label: "周六", value: 6 },
                        { label: "周日", value: 7 }],
                    value: [1, 2]
                }
            },
            prompt: {
                //周期插播计划
                cycleName: true, cycleInterval: true, cyclePause: true, cycleDate: true, cycleTime: true, cycleWeek: true
            }
        }

        this.onChange = this.onChange.bind(this);
        this.dateChange = this.dateChange.bind(this);
        this.cyclePlanClick = this.cyclePlanClick.bind(this);
    }

    cyclePlanClick(id) {
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
        if(id == "cyclePause"){
            const curIndex = value.target.selectedIndex;
            this.setState({
                property: Object.assign({}, this.state.property, {
                    [id]: Object.assign({}, this.state.property[id], {
                        index: curIndex,
                        name: this.state.property[id].list[curIndex].name
                    })
                })
            })
        }else if(id == "cycleDate" || id == "cycleTime"){
            this.setState({ property: Object.assign({}, this.state.property, { [id]: Object.assign({}, this.state.property[id], { appoint: value.target.checked }) }) })
        }else{
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
    }

    render(){
        const {property, prompt} = this.state;
        return <div className={"pro-container cyclePlan "}>
            <div className="row">
                <div className="form-group cycle-name">
                    <label className="control-label"
                           htmlFor={property.cycleName.key}>{property.cycleName.title}</label>
                    <div className="input-container">
                        <input type="text" className="form-control" placeholder={property.cycleName.placeholder} value={property.cycleName.value} onChange={event => this.onChange("cycleName", event)} />
                        <span className={prompt.cycleName ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="form-group cycle-interval">
                    <label className="control-label"
                           htmlFor={property.cycleInterval.key}>{property.cycleInterval.title}</label>
                    <div className="input-container">
                        <input type="text" className="form-control" placeholder={property.cycleInterval.placeholder} value={property.cycleInterval.value} onChange={event => this.onChange("cycleInterval", event)} />
                        <span className={prompt.cycleInterval ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>
                    </div>
                </div>
                <div className="form-group cycle-pause">
                    <label className="control-label"
                           htmlFor={property.cyclePause.key}>{property.cyclePause.title}</label>
                    <div className="input-container">
                        <select className={"form-control"} value={property.cyclePause.name} onChange={event => this.onChange("cyclePause", event)}>
                            {
                                property.cyclePause.list.map((option, index) => {
                                    let value = option.name;
                                    return <option key={index} value={value}>
                                        {value}
                                    </option>
                                })}
                        </select>
                        {/*<span className={prompt.cyclePause?"prompt ":"prompt hidden"}>{"请输入正确参数"}</span>*/}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="form-group cycle-startDate">
                    <label className="control-label"
                           htmlFor={property.cycleStartDate.key}>{property.cycleStartDate.title}</label>
                    <div className="input-container">
                        <DatePicker id="cycleStartDate" showTime format="YYYY-MM-DD" placeholder="点击选择开始日期" style={{ width: "200px" }}
                                    defaultValue={property.cycleStartDate.value} onChange={value => this.dateChange('cycleStartDate', value)} />
                        <div className={prompt.cycleStartDate ? "prompt " : "prompt hidden"}>{"请选择开始日期"}</div>
                    </div>
                </div>
                <div className="form-group cycle-endDate">
                    <label className="control-label"
                           htmlFor={property.cycleEndDate.key}>{property.cycleEndDate.title}</label>
                    <div className="input-container">
                        <DatePicker id="cycleEndDate" showTime format="YYYY-MM-DD" placeholder="点击选择结束日期" style={{ width: "200px" }}
                                    defaultValue={property.cycleEndDate.value} onChange={value => this.dateChange('cycleEndDate', value)} />
                        <div className={prompt.cycleEndDate ? "prompt " : "prompt hidden"}>{"请选择结束日期"}</div>
                    </div>
                </div>
                <div className="form-group cycle-date">
                    <label className="control-label"
                           htmlFor={property.cycleDate.key}>{property.cycleDate.title}</label>
                    <div className="input-container">
                        <Checkbox checked={property.cycleDate.appoint} onChange={event => this.onChange("cycleDate", event)} />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="form-group cycle-startTime">
                    <label className="control-label"
                           htmlFor={property.cycleStartTime.key}>{property.cycleStartTime.title}</label>
                    <div className="input-container">
                        <DatePicker id="cycleStartTime" showTime format="HH:mm:ss" placeholder="点击选择开始时间" style={{ width: "200px" }}
                                    defaultValue={property.cycleStartTime.value} onChange={value => this.dateChange('cycleStartTime', value)} />
                        <div className={prompt.cycleStartTime ? "prompt " : "prompt hidden"}>{"请选择开始时间"}</div>
                    </div>
                </div>
                <div className="form-group cycle-endTime">
                    <label className="control-label"
                           htmlFor={property.cycleEndTime.key}>{property.cycleEndTime.title}</label>
                    <div className="input-container">
                        <DatePicker id="cycleEndTime" showTime format="HH:mm:ss" placeholder="点击选择结束时间" style={{ width: "200px" }}
                                    defaultValue={property.cycleEndTime.value} onChange={value => this.dateChange('cycleEndTime', value)} />
                        <div className={prompt.cycleEndTime ? "prompt " : "prompt hidden"}>{"请选择结束时间"}</div>
                    </div>
                </div>
                <div className="form-group cycle-time">
                    <label className="control-label"
                           htmlFor={property.cycleTime.key}>{property.cycleTime.title}</label>
                    <div className="input-container">
                        <Checkbox checked={property.cycleTime.appoint} onChange={event => this.onChange("cycleTime", event)} />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="form-group cycle-week">
                    <label className="control-label"
                           htmlFor={property.cycleWeek.key}>{property.cycleWeek.title}</label>
                    <div className="input-container">
                        <CheckboxGroup id="cycleWeek" options={property.cycleWeek.list} defaultValue={property.cycleWeek.value} onChange={value => this.dateChange('cycleWeek', value)} />
                        <span className={"fixpos " + (prompt.cycleWeek ? "prompt " : "prompt hidden")}>{"请选择工作日"}</span>
                    </div>
                </div>
            </div>
            <div className="row">
                <button className="btn btn-primary pull-right" onClick={() => { this.cyclePlanClick('apply') }}>应用</button>
                <button className="btn btn-gray pull-right" onClick={() => { this.cyclePlanClick('reset') }}>重置</button>
            </div>
        </div>
    }
}