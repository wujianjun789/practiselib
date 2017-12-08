/**
 * Created by a on 2017/11/20.
 */
import React,{ PureComponent } from 'react';

import { DatePicker, Checkbox,TimePicker } from 'antd';

const CheckboxGroup = Checkbox.Group;

import moment from 'moment';
import lodash from 'lodash';

import {getPlayerById} from '../../api/mediaPublish';
import { NameValid, numbersValid } from '../../util/index';

import { FormattedMessage,injectIntl } from 'react-intl';

class CyclePlan extends PureComponent{
    constructor(props){
        super(props);
        const {name, interval, pause, dateAppoint, startDate, endDate, timeAppoint, startTime, endTime, week}  = props;
        this.state = {
            property: {
                //周期插播计划
                cycleName: { key: "cycleName", title: this.props.intl.formatMessage({id:'mediaPublish.planName'}), placeholder: this.props.intl.formatMessage({id:'mediaPublish.inputPlanName'}), defaultValue:name?name:"", value: name?name:"" },
                cycleInterval: { key: "cycleInterval", title: this.props.intl.formatMessage({id:'mediaPublish.timeInterval'}), placeholder: '秒', defaultValue:interval?interval:5, value: interval?interval:5 },
                cyclePause: { key: "cyclePause", title:this.props.intl.formatMessage({id:'mediaPublish.pauseSign'}), list: [{ id: '1', name: '暂停' }, { id: '2', name: '不暂停' }], defaultIndex: 0, index: 0, name: "暂停" },
                cycleDate: { key: "cycleDate", title: this.props.intl.formatMessage({id:'mediaPublish.specifyDate'}), defaultAppoint:dateAppoint?dateAppoint:false, appoint: dateAppoint?dateAppoint:false },
                cycleStartDate: { key: "cycleStartDate", title: this.props.intl.formatMessage({id:'mediaPublish.startDate'}), placeholder: "点击选择开始日期", defaultValue:startDate?startDate:moment(),value: startDate?startDate:moment() },
                cycleEndDate: { key: "cycleEndDate", title: this.props.intl.formatMessage({id:'mediaPublish.endDate'}), placeholder: "点击选择结束日期", defaultValue:endDate?endDate:moment(),value: endDate?endDate:moment() },
                cycleTime: { key: "cycleDate", title: this.props.intl.formatMessage({id:'mediaPublish.specifyTime'}), defaultAppoint:timeAppoint?timeAppoint:false, appoint: timeAppoint?timeAppoint:false },
                cycleStartTime: { key: "cycleStartTime", title: this.props.intl.formatMessage({id:'mediaPublish.startTime'}), placeholder: "点击选择开始时间", defaultValue:startTime?startTime:moment(), value: startTime?startTime:moment() },
                cycleEndTime: { key: "cycleEndTime", title: this.props.intl.formatMessage({id:'mediaPublish.endTime'}), placeholder: "点击选择结束时间", defaultValue:endTime?endTime:moment(), value: endTime?endTime:moment() },
                cycleWeek: {
                    key: "cycleWeek", title:this.props.intl.formatMessage({id:'mediaPublish.weekday'}),defaultValue: week?week:[], value: week?week:[],
                    list: [{ label: this.props.intl.formatMessage({id:'mediaPublish.monday'}), value: 1 }, { label: this.props.intl.formatMessage({id:'mediaPublish.tuesday'}), value: 2 },
                        { label: this.props.intl.formatMessage({id:'mediaPublish.wednesday'}), value: 3 }, { label: this.props.intl.formatMessage({id:'mediaPublish.thursday'}), value: 4 },
                        { label: this.props.intl.formatMessage({id:'mediaPublish.friday'}), value: 5 }, { label:this.props.intl.formatMessage({id:'mediaPublish.saturday'}), value: 6 },
                        { label: this.props.intl.formatMessage({id:'mediaPublish.sunday'}), value: 7 }],
                }
            },
            prompt: {
                //周期插播计划
                cycleName: name?false:true, cycleInterval: false, cyclePause: pause?false:true, /*cycleDate: true, cycleTime: true,*/ cycleWeek: week && week.length?false:true
            }
        }

        this.onChange = this.onChange.bind(this);
        this.dateChange = this.dateChange.bind(this);
        this.cyclePlanClick = this.cyclePlanClick.bind(this);
        this.updateCyclePause = this.updateCyclePause.bind(this);
        this.initProperty = this.initProperty.bind(this);
    }

    componentWillMount(){
        this.mounted = true;
        const {id, pause} = this.props;
        this.updateCyclePause(pause);
        getPlayerById(id, data=>{this.mounted && this.initProperty(data)})
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    initProperty(data){
        const pauseList = this.state.property.cyclePause.list;
        const pauseIndex = lodash.findIndex(pauseList, item=>{
            return item.name = data.pauseName;
        })
        this.state.property.cycleName.defaultValue = this.state.property.cycleName.value = data.name;
        this.state.property.cycleInterval.defaultValue = this.state.property.cycleInterval.value = data.interval;
        // this.state.property.cyclePause.defaultIndex = this.state.property.cyclePause.index = pauseIndex;
        // this.state.property.cyclePause.name = pauseList[pauseIndex].name;
        this.updateCyclePause(pauseIndex);
        this.state.property.cycleDate.defaultAppoint = this.state.property.cycleDate.appoint =  data.dateAppoint;
        this.state.property.cycleStartDate.defaultValue = this.state.property.cycleStartDate.value = data.startDate;
        this.state.property.cycleEndDate.defaultValue = this.state.property.cycleEndDate.value = data.endDate;
        this.state.property.cycleTime.defaultAppoint = this.state.property.cycleTime.appoint =  data.timeAppoint;
        this.state.property.cycleStartTime.defaultValue = this.state.property.cycleStartTime.value = data.startTime;
        this.state.property.cycleEndTime.defaultValue = this.state.property.cycleEndTime.value = data.endTime;
        this.state.property.cycleWeek.defaultValue = this.state.property.cycleWeek.value = data.week;

        this.setState({property: Object.assign({}, this.state.property),
            prompt:{cycleName: data.name?false:true, cycleInterval: data.interval?false:true, cyclePause: pauseIndex>-1?false:true,  cycleWeek: data.week && data.week.length?false:true}})
    }

    updateCyclePause(pause){
        const pauseList = this.state.property.cyclePause.list;
        if(pause != undefined && pause > -1 && pause < pauseList.length){
            this.state.property.cyclePause.defaultIndex = pause;
            this.state.property.cyclePause.index = pause;
            this.state.property.cyclePause.name = pauseList[pause].name;

            this.setState({property: Object.assign({}, this.state.property)});
        }
    }

    cyclePlanClick(id) {
        console.log(id);
        switch (id) {
            case "apply":
                break;
            case "reset":
                for(let key in this.state.property){
                    if(key == "cyclePause"){
                        const index = this.state.property[key].defaultIndex;
                        // this.state.property[key].index = index;
                        // this.state.property[key].name = this.state.property[key].list[index].name;
                        this.updateCyclePause(index);
                    }else if(key == "cycleDate" || key == "cycleTime"){
                        this.state.property[key].appoint = this.state.property[key].defaultAppoint;
                    }else{
                        this.state.property[key].value = this.state.property[key].defaultValue;
                    }

                }

                for(let key in this.state.prompt){
                    if(key == "cyclePause"){
                        this.state.prompt[key] = this.state.property[key].defaultIndex>-1?false:true;
                    }else if(key == "cycleWeek"){
                        const defaultValue2 = this.state.property[key].defaultValue;
                        this.state.prompt[key] = defaultValue2.length?false:true;
                    }else{
                        const defaultValue = this.state.property[key].defaultValue;
                        this.state.prompt[key] = defaultValue?false:true;
                    }


                }

                this.setState({property: Object.assign({}, this.state.property), prompt: Object.assign({}, this.state.prompt)});
                break;
        }
    }

    dateChange(id, value) {
        if (id == "cycleWeek") {
            console.log(value);
            this.setState({ property: Object.assign({}, this.state.property, { [id]: Object.assign({}, this.state.property[id], { value: value }) }),
            prompt:Object.assign({}, this.state.prompt, {[id]: value.length?false:true})});
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
            if(id == "cycleName"){
                if (!NameValid(val)) {
                    prompt = true;
                }
            }else if(id == "cycleInterval"){
                if(!numbersValid(val)){
                    prompt = true;
                }
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
                        <span className={prompt.cycleName ? "prompt " : "prompt hidden"}><FormattedMessage id='mediaPublish.check'/></span>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="form-group cycle-interval">
                    <label className="control-label"
                           htmlFor={property.cycleInterval.key}>{property.cycleInterval.title}</label>
                    <div className="input-container">
                        <input type="text" className="form-control" placeholder={property.cycleInterval.placeholder} value={property.cycleInterval.value} onChange={event => this.onChange("cycleInterval", event)} />
                        <span className={prompt.cycleInterval ? "prompt " : "prompt hidden"}><FormattedMessage id='mediaPublish.check'/></span>
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
                        <DatePicker id="cycleStartDate" showTime format="YYYY/MM/DD" placeholder="点击选择开始日期" style={{ width: "100px" }}
                                    defaultValue={property.cycleStartDate.value} value={property.cycleStartDate.value} onChange={value => this.dateChange('cycleStartDate', value)} />
                        <div className={prompt.cycleStartDate ? "prompt " : "prompt hidden"}>{"请选择开始日期"}</div>
                    </div>
                </div>
                <div className="form-group cycle-endDate">
                    <label className="control-label"
                           htmlFor={property.cycleEndDate.key}>{property.cycleEndDate.title}</label>
                    <div className="input-container">
                        <DatePicker id="cycleEndDate" showTime format="YYYY/MM/DD" placeholder="点击选择结束日期" style={{ width: "100px" }}
                                    defaultValue={property.cycleEndDate.value} value={property.cycleEndDate.value} onChange={value => this.dateChange('cycleEndDate', value)} />
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
                        <TimePicker size="large" placeholder={property.cycleStartTime.placeholder}  style={{ width: "100px" }} onChange={value => this.dateChange("cycleStartTime", value)}
                                    defaultValue={property.cycleStartTime.value} value={property.cycleStartTime.value} />
                        <div className={prompt.cycleStartTime ? "prompt " : "prompt hidden"}>{"请选择开始时间"}</div>
                    </div>
                </div>
                <div className="form-group cycle-endTime">
                    <label className="control-label"
                           htmlFor={property.cycleEndTime.key}>{property.cycleEndTime.title}</label>
                    <div className="input-container">
                        <TimePicker  size="large" placeholder={property.cycleEndTime.placeholder} style={{ width: "100px" }} onChange={value => this.dateChange("cycleEndTime", value)}
                                     defaultValue={property.cycleEndTime.value}value={property.cycleEndTime.value} />
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
                        <CheckboxGroup id="cycleWeek" options={property.cycleWeek.list} defaultValue={property.cycleWeek.value} value={property.cycleWeek.value} onChange={value => this.dateChange('cycleWeek', value)} />
                        <span className={"fixpos " + (prompt.cycleWeek ? "prompt " : "prompt hidden")}><FormattedMessage id='mediaPublish.selectWeekday'/></span>
                    </div>
                </div>
            </div>
            <div className="row">
                <button className="btn btn-primary pull-right" onClick={() => { this.cyclePlanClick('apply') }}><FormattedMessage id='mediaPublish.apply'/></button>
                <button className="btn btn-gray pull-right" onClick={() => { this.cyclePlanClick('reset') }}><FormattedMessage id='mediaPublish.reset'/></button>
            </div>
        </div>
    }
}

export default injectIntl(CyclePlan)