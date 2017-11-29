/**
 * Created by a on 2017/11/20.
 */
import React,{ PureComponent } from 'react';

import { DatePicker, Checkbox, TimePicker} from 'antd';

const CheckboxGroup = Checkbox.Group;

import moment from 'moment'

import {getPlayerById} from '../../api/mediaPublish'
import { NameValid } from '../../util/index';
export default class PlayerPlan extends PureComponent{
    constructor(props){
        super(props);
        const {name="", startDate=moment(), endDate=moment(), startTime=moment(), endTime=moment(), week=[]} = props;
        this.state = {
            //计划
            property:{
                plan: { key: "plan", title: "计划名称", placeholder: "请输入名称", defaultValue:name, value: name },
                startDate: { key: "startDate", title: "开始日期", placeholder: "点击选择开始日期", defaultValue:startDate,value: startDate },
                endDate: { key: "endDate", title: "结束日期", placeholder: "点击选择结束日期", defaultValue:endDate, value: endDate },
                startTime: { key: "startTime", title: "开始时间", placeholder: "点击选择开始时间", defaultValue:startTime, value: startTime },
                endTime: { key: "endTime", title: "结束时间", placeholder: "点击选择结束时间", defaultValue:endTime, value: endTime },
                week: {
                    key: "week", title: "工作日",
                    list: [{ label: "周一", value: 1 }, { label: "周二", value: 2 },
                        { label: "周三", value: 3 }, { label: "周四", value: 4 },
                        { label: "周五", value: 5 }, { label: "周六", value: 6 },
                        { label: "周日", value: 7 }],
                    defaultValue: week,
                    value: week
                }
            },
            prompt:{
                //计划
                plan:name?false:true,week:week && week.length?false:true,
                /*action: false, axisX: true, axisY: true, speed: true, repeat: true, resTime: true, flicker: true,*/
            }
        }

        this.onChange = this.onChange.bind(this);
        this.dateChange = this.dateChange.bind(this);
        this.planClick = this.planClick.bind(this);
        this.initProperty = this.initProperty.bind(this);
    }

    componentWillMount(){
        this.mounted = true;
        const {id} = this.props;
        getPlayerById(id, data=>{this.mounted && this.initProperty(data);})
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    initProperty(data){
        this.state.property.plan.defaultValue = this.state.property.plan.value = data.name;
        this.state.property.startDate.defaultValue = this.state.property.startDate.value = data.startDate;
        this.state.property.endDate.defaultValue = this.state.property.endDate.value = data.endDate;
        this.state.property.startTime.defaultValue = this.state.property.startTime.value = data.startTime;
        this.state.property.endTime.defaultValue = this.state.property.endTime.value = data.endTime;
        this.state.property.endTime.defaultValue = this.state.property.endTime.value = data.week;

        this.setState({property: Object.assign({}, this.state.property),
        prompt: {plan:data.name?false:true,week: data.week && data.week.length?false:true,}})
    }

    planClick(id) {
        console.log(id);
        switch (id) {
            case "apply":
                break;
            case "reset":
                for(let key in this.state.property){
                    this.state.property[key].value = this.state.property[key].defaultValue;
                }

                for (let key in this.state.prompt){
                    if(key == "week"){
                        const defaultValue = this.state.property[key].defaultValue;
                        this.state.prompt[key] = defaultValue && defaultValue.length ? false:true;
                    }else{
                        const defaultValue2 = this.state.property[key].defaultValue;
                        this.state.prompt[key] = defaultValue2 ? false:true;
                    }
                }
                this.setState({property:Object.assign({}, this.state.property), prompt:Object.assign({}, this.state.prompt)});
                break;
        }
    }

    dateChange(id, value) {
        if (id == "week") {
            console.log(value);
            this.setState({ property: Object.assign({}, this.state.property, { [id]: Object.assign({}, this.state.property[id], { value: value }) }),
            prompt:Object.assign({}, this.state.prompt, {[id]:value.length?false:true})});
        } else {
            this.setState({ property: Object.assign({}, this.state.property, { [id]: Object.assign({}, this.state.property[id], { value: value }) }) });
        }
    }


    onChange(id, value) {
        console.log("id:", id);
        let prompt = false;

        const val = value.target.value;
        if(id == "plan"){
            if (!NameValid(val)) {
                prompt = true;
            }
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
                        <DatePicker id="startDate" format="YYYY-MM-DD" placeholder="点击选择开始日期" style={{ width: "250px" }}
                                    defaultValue={property.startDate.value} value={property.startDate.value} onChange={value => this.dateChange('startDate', value)} />
                        <div className={prompt.startDate ? "prompt " : "prompt hidden"}>{"请选择开始日期"}</div>
                    </div>
                </div>
                <div className="form-group endDate">
                    <label className="control-label"
                           htmlFor={property.endDate.key}>{property.endDate.title}</label>
                    <div className="input-container">
                        <DatePicker id="endDate" format="YYYY-MM-DD" placeholder="点击选择结束日期" style={{ width: "250px" }}
                                    defaultValue={property.endDate.value} value={property.endDate.value} onChange={value => this.dateChange('endDate', value)} />
                        <div className={prompt.endDate ? "prompt " : "prompt hidden"}>{"请选择结束日期"}</div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="form-group startTime">
                    <label className="control-label"
                           htmlFor={property.startTime.key}>{property.startTime.title}</label>
                    <div className="input-container">
                        <TimePicker size="large" placeholder={property.startTime.placeholder} onChange={value => this.dateChange("startTime", value)} defaultValue={property.startTime.value} value={property.startTime.value} />
                        <div className={prompt.startTime ? "prompt " : "prompt hidden"}>{"请选择开始时间"}</div>
                    </div>
                </div>
                <div className="form-group endTime">
                    <label className="control-label"
                           htmlFor={property.endTime.key}>{property.endTime.title}</label>
                    <div className="input-container">
                        <TimePicker size="large" placeholder={property.endTime.placeholder} onChange={value => this.dateChange("endTime", value)} defaultValue={property.endTime.value}value={property.endTime.value} />
                        <div className={prompt.endTime ? "prompt " : "prompt hidden"}>{"请选择结束时间"}</div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="form-group week">
                    <label className="control-label"
                           htmlFor={property.week.key}>{property.week.title}</label>
                    <div className="input-container">
                        <CheckboxGroup id="startTime" options={property.week.list} defaultValue={property.week.value}
                                       value={property.week.value} onChange={value => this.dateChange('week', value)} />
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