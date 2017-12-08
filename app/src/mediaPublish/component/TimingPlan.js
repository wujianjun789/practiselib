/**
 * Created by a on 2017/11/20.
 */
import React,{ PureComponent } from 'react';

import TimingPlanPopup from '../component/TimingPlanPopup';
import ConfirmPopup from '../../components/ConfirmPopup';

import { weekReplace } from '../util/index';

import { momentDateFormat, dateStrReplaceZh } from '../../util/time';
import {DeepCopy} from '../../util/algorithm';
import { NameValid, numbersValid } from '../../util/index';

import {getPlayerById} from '../../api/mediaPublish';

import { FormattedMessage, injectIntl, FormattedDate } from 'react-intl';

import moment from 'moment';
import lodash from 'lodash';
class TimingPlan extends PureComponent{
    constructor(props){
        super(props);
        const {name="", timingList= [{ id: 1, startTime: moment(), startDate: moment(), endDate: moment(), appointDate: false, week: [1, 2, 5] },
            { id: 2, startTime: moment(), startDate: moment(), endDate: moment(), appointDate: false, week: [2, 4, 6] },], timingPlayIndex=0, playModeCount=0, playTimeCount=0, pauseIndex=0} = this.props;
        this.state = {
            property: {
                //定时插播计划
                timingName: { key: "timingName", title: this.props.intl.formatMessage({id:'mediaPublish.planName'}), placeholder: this.props.intl.formatMessage({id:'mediaPublish.inputPlanName'}), defaultValue:name?name:"", value: name?name:"" },
                timingList: {
                    key: "timingList", title: this.props.intl.formatMessage({id:'mediaPublish.timingPlay'}),
                    list:timingList?DeepCopy(timingList):[],
                    index: 0, id: 1,
                    defaultList:timingList?timingList:[],
                    sort: { list: [{ id: 1, name: "时间排序" }, { id: 2, name: "日期排序" }], index: 0, name: "时间排序" },
                },
                timingPlayMode: { key: "timingPlayMode", title: this.props.intl.formatMessage({id:'mediaPublish.playingMode'}), list: [{ id: 1, name: "按次播放" }, { id: 2, name: "按时长播放" }, { id: 3, name: "循环播放" }],
                    defaultIndex: 0, index: 0, name: "按次播放" },
                timingPlayModeCount: { key: "timingPlayModeCount", title: this.props.intl.formatMessage({id:'mediaPublish.repeatTimes'}), placeholder: this.props.intl.formatMessage({id:'mediaPublish.number'}),active: true,
                    defaultValue:playModeCount?playModeCount:"", value: playModeCount?playModeCount:"",
                    defaultValue2:playTimeCount?playTimeCount:"", value2: playTimeCount?playTimeCount:""},
                timingPause: { key: "timingPause", title: this.props.intl.formatMessage({id:'mediaPublish.pauseSign'}), list: [{ id: '1', name: '暂停' }, { id: '2', name: '不暂停' }],
                    defaultIndex: 0,index: 0, name: "暂停" },
            },
            prompt: {
                //定时插播计划
                timingName: name?false:true, timingPlayModeCount: playModeCount?false:true
            }
        }

        this.onChange = this.onChange.bind(this);
        this.timingPlanSelect = this.timingPlanSelect.bind(this);
        this.timingPlanClick = this.timingPlanClick.bind(this);
        this.updateTimingPlanPopup = this.updateTimingPlanPopup.bind(this);
        this.updateTimingPlayMode = this.updateTimingPlayMode.bind(this);
        this.updateTimingPause = this.updateTimingPause.bind(this);
        this.initProperty = this.initProperty.bind(this);
    }

    componentWillMount(){
        this.mounted = true;
        const {id, timingPlayIndex, pauseIndex} = this.props;
        this.updateTimingPlayMode(timingPlayIndex);
        this.updateTimingPause(pauseIndex);

        getPlayerById(id,response=>{this.mounted && this.initProperty(response)})
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    initProperty(data){
        const modeList = this.state.property.timingPlayMode.list;
        const pauseList = this.state.property.timingPause.list;
        const modeIndex = lodash.findIndex(modeList, item=>{
            return item.name = data.modeName;
        })
        const pauseIndex = lodash.findIndex(pauseList, item=>{
            return item.name = data.pauseName;
        })

        this.state.property.timingName.defaultValue = this.state.property.timingName.value = data.name;
        this.state.property.timingList.defaultList = this.state.property.timingList.list = data.list;
        // this.state.property.timingPlayMode.defaultIndex = this.state.property.timingPlayMode.index = modeIndex;
        // this.state.property.timingPlayMode.name = modeList[modeIndex].name;
        this.updateTimingPlayMode(modeIndex);

        this.state.property.timingPlayModeCount.defaultValue = this.state.property.timingPlayModeCount.value = data.playCount;
        this.state.property.timingPlayModeCount.defaultValue2 = this.state.property.timingPlayModeCount.value2 = data.playTime;
        // this.state.property.timingPause.defaultIndex = this.state.property.timingPause.index = pauseIndex;
        // this.state.property.timingPause.name = pauseList[pauseIndex].name;
        this.updateTimingPause(pauseIndex);
        this.setState({property: Object.assign({}, this.state.property), prompt:{timingName:data.name?false:true, timingPlayModeCount:(modeIndex==0 && data.playCount || modeIndex==1 && data.playTime)?false:true}});
    }

    updateTimingPlayMode(timingPlayIndex){
        const timingPlayModeList = this.state.property.timingPlayMode.list;
        if(timingPlayIndex != undefined && timingPlayIndex>-1 && timingPlayIndex < timingPlayModeList.length){
            this.state.property.timingPlayMode.defaultIndex = timingPlayIndex;
            this.state.property.timingPlayMode.index = timingPlayIndex;
            this.state.property.timingPlayMode.name = timingPlayModeList[timingPlayIndex].name;
            if(timingPlayIndex == 2){
                this.state.property.timingPlayModeCount.active = false;
            }else{
                this.state.property.timingPlayModeCount.active = true;
            }

            this.setState({property: Object.assign({}, this.state.property)});
        }
    }

    updateTimingPause(pauseIndex){
        const timingPauseList = this.state.property.timingPause.list;
        if(pauseIndex != undefined && pauseIndex>-1 && pauseIndex < timingPauseList.length){
            this.state.property.timingPause.defaultIndex = pauseIndex;
            this.state.property.timingPause.index = pauseIndex;
            this.state.property.timingPause.name = timingPauseList[pauseIndex].name;

            this.setState({property: Object.assign({}, this.state.property)});
        }
    }

    timingPlanClick(id, itemId) {
        console.log(id);
        switch (id) {
            case "apply":
                break;
            case "reset":
                for(let key in this.state.property){
                    if(key == "timingList"){
                        const index = 0;
                        this.state.property[key].list = this.state.property[key].defaultList;
                        this.state.property[key].index = index;
                        this.state.property[key].name = this.state.property[key].list[index].id;
                    }else if(key == "timingPlayMode"){
                        const curIndex = this.state.property[key].defaultIndex;
                        // this.state.property[key].index = curIndex;
                        // this.state.property[key].name = this.state.property[key].list[curIndex].name;
                        this.updateTimingPlayMode(curIndex);
                    }else if(key == "timingPause"){
                        const curIndex2 = this.state.property[key].defaultIndex;
                        this.updateTimingPause(curIndex2);
                    }else{
                        this.state.property[key].value = this.state.property[key].defaultValue;
                        if(key == "timingPlayModeCount"){
                            this.state.property[key].value2 = this.state.property[key].defaultValue2;
                        }
                    }
                }

                for(let key in this.state.prompt){
                    const defaultValue = this.state.property[key].defaultValue;
                    this.state.prompt[key] = defaultValue?false:true;
                }
                this.setState({property: Object.assign({}, this.state.property), prompt: Object.assign({}, this.state.prompt)});
                break;
            case "sort-add":
                const data = {
                    startTime: moment(),
                    startDate: moment(),
                    endDate: moment(),
                    week: []
                }
                this.updateTimingPlanPopup(data);
                break;
            case "sort-edit":
                const data2 = {
                    startTime: moment(),
                    startDate: moment(),
                    endDate: moment(),
                    week: [1, 0, 1, 0, 1, 1, 1]
                }
                this.updateTimingPlanPopup(data2);
                break;
            case "sort-remove":
                const {actions} = this.props;
                actions.overlayerShow(<ConfirmPopup iconClass="icon_popup_delete" tips="是否删除选中时间段？"
                                            cancel={() => { actions.overlayerHide() }} confirm={() => {
                    let list = this.state.property.timingList.list;
                    const curIndex = lodash.findIndex(list, function(item) {
                        return item.id  == itemId
                    })

                     let activeId = this.state.property.timingList.id;
                     let activeIndex = this.state.property.timingList.index;
                    if(curIndex>-1 && curIndex < list.length){
                        list.splice(curIndex, 1);
                    }

                    if(itemId == activeId){
                        activeIndex = 0;
                        activeId = this.state.property.timingList.list[activeIndex].id;
                    }
                    console.log("timing:",list, curIndex)
                   this.setState({property:Object.assign({}, this.state.property, {timingList:Object.assign({}, this.state.property.timingList, {list:list, id:activeId, index:activeIndex})})},()=>{
                        actions.overlayerHide();
                   });
                }} />)
                break;
        }

    }

    updateTimingPlanPopup(data) {
        const { actions } = this.props;
        actions.overlayerShow(<TimingPlanPopup title="添加/修改插播计划" data={data}
                                   onCancel={() => { actions.overlayerHide() }} onConfirm={(state) => {
        }} />)
    }

    timingPlanSelect(item) {
        this.setState({ property: Object.assign({}, this.state.property, { timingList: Object.assign({}, this.state.property.timingList, { id: item.id }) }) });
    }

    onChange(id, value) {
        console.log("id:", id);
        if(id == "timingPause"){
            const curIndex = value.target.selectedIndex;
            this.setState({
                property: Object.assign({}, this.state.property, {
                    [id]: Object.assign({}, this.state.property[id], {
                        index: curIndex,
                        name: this.state.property[id].list[curIndex].name
                    })
                })
            })
        }else if(id == "timingList-sort"){
            const curIndex = value.target.selectedIndex;
            this.setState({
                property: Object.assign({}, this.state.property,
                    {
                        timingList: Object.assign({}, this.state.property.timingList,
                            { sort: Object.assign({}, this.state.property.timingList.sort, { index: curIndex, name: this.state.property.timingList.sort.list[curIndex].name }) })
                    })
            })
        }else if(id == "timingPlayMode"){
            const curIndex = value.target.selectedIndex;
            console.log("correct", curIndex);
            let title = "播放次数";
            let placeholder = this.props.intl.formatMessage({id:'mediaPublish.number'});
            let active = true;
            let updateId =  "timingPlayModeCount";
            let prompt = false;
            switch (curIndex) {
                case 0:
                    title = "播放次数";
                    placeholder = this.props.intl.formatMessage({id:'mediaPublish.number'});
                    if(!numbersValid(this.state.property.timingPlayModeCount.value)){
                        prompt = true;
                    }
                    break;
                case 1:
                    title = "播放时长";
                    placeholder = "秒";
                    if(!numbersValid(this.state.property.timingPlayModeCount.value2)){
                        prompt = true;
                    }
                    break;
                case 2:
                    active = false;
                    break;
            }
            this.setState({
                property: Object.assign({}, this.state.property,
                    { [id]: Object.assign({}, this.state.property[id], { index: curIndex, name: this.state.property[id].list[curIndex].name }) },
                    { [updateId]: Object.assign({}, this.state.property[updateId], { title: title, placeholder: placeholder, active: active })}),
                prompt: Object.assign({}, this.state.prompt, {timingPlayModeCount: prompt})
            })
        }else{
            let prompt = false;

            const val = value.target.value;
            if(id == "timingName"){
                if (!NameValid(val)) {
                    prompt = true;
                }
            }else if(id == "timingPlayModeCount"){
                if(!numbersValid(val)){
                    prompt = true;
                }
            }

            let valueKey = {};
            if(id == "timingPlayModeCount" && this.state.property.timingPlayMode.index==1){
                valueKey = {value2: val};
            }else{
                valueKey = {value: val};
            }
            this.setState({
                property: Object.assign({}, this.state.property, { [id]: Object.assign({}, this.state.property[id], valueKey) }),
                prompt: Object.assign({}, this.state.prompt, { [id]: prompt })
            })
        }
    }

    render(){
        const {property, prompt} = this.state;
        return <div className={"pro-container timingPlan "}>
            <div className="row">
                <div className="form-group timing-name">
                    <label className="control-label"
                           htmlFor={property.timingName.key}>{property.timingName.title}</label>
                    <div className="input-container">
                        <input type="text" className="form-control" placeholder={property.timingName.placeholder} value={property.timingName.value} onChange={event => this.onChange("timingName", event)} />
                        <span className={prompt.timingName ? "prompt " : "prompt hidden"}><FormattedMessage id='mediaPublish.check'/></span>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="form-group timing-list">
                    <label className="control-label"
                           htmlFor={property.timingList.key}>{property.timingList.title}</label>
                    <div className="input-container">
                        <div className="edit-head">
                            <select value={property.timingList.sort.name} onChange={event => this.onChange("timingList-sort", event)}>
                                {
                                    property.timingList.sort.list.map((option, index) => {
                                        let value = option.name;
                                        return <option key={index} value={value}>
                                            {value}
                                        </option>
                                    })}
                            </select>
                            <button className="btn btn-primary timing-sort-add" onClick={() => { this.timingPlanClick('sort-add') }}><FormattedMessage id='button.add'/></button>
                            <button className="btn btn-gray timing-sort-edit" onClick={() => { this.timingPlanClick('sort-edit') }}><FormattedMessage id='button.edit'/></button>
                        </div>
                        <div className="edit-body">
                            <ul>
                                {
                                    property.timingList.list.map(item => {
                                        let dateStr = dateStrReplaceZh(momentDateFormat(item.startDate, "YYYY-MM-DD")) + ' 至 ' + dateStrReplaceZh(momentDateFormat(item.endDate, "YYYY-MM-DD"));
                                        let weekStr = weekReplace(item.week);
                                        return <li key={item.id} onClick={() => this.timingPlanSelect(item)}>
                                            <div className={"background " + (property.timingList.id == item.id ? '' : 'hidden')}></div>
                                            {'[' + momentDateFormat(item.startTime, 'HH:mm') + ']'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'[' + dateStr + ']'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'[' + weekStr + ']'}
                                            <span className="icon icon-delete pull-right" onClick={() => this.timingPlanClick('sort-remove', item.id)}></span>
                                        </li>
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="form-group">
                    <label className="control-label"
                           htmlFor={property.timingPlayMode.key}>{property.timingPlayMode.title}</label>
                    <div className="input-container">
                        <select className={"form-control"} value={property.timingPlayMode.name} onChange={event => this.onChange("timingPlayMode", event)}>
                            {
                                property.timingPlayMode.list.map((option, index) => {
                                    let value = option.name;
                                    return <option key={index} value={value}>
                                        {value}
                                    </option>
                                })}
                        </select>
                        {/*<span className={prompt.playMode?"prompt ": "prompt hidden"}>{"请输入正确参数"}</span>*/}
                    </div>
                </div>
                <div className={"form-group  pull-right" + (property.timingPlayModeCount.active ? '' : 'hidden')}>
                    <label className="control-label">{property.timingPlayModeCount.title}</label>
                    <div className={"input-container "}>
                        <input type="text" className={"form-control "} htmlFor={property.timingPlayModeCount.key} placeholder={property.timingPlayModeCount.placeholder} maxLength="8"
                               value={property.timingPlayMode.index==0?property.timingPlayModeCount.value:property.timingPlayModeCount.value2} onChange={event => this.onChange("timingPlayModeCount", event)} />
                        <span className={prompt.timingPlayModeCount ? "prompt " : "prompt hidden"}><FormattedMessage id='mediaPublish.check'/></span>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="form-group timing-pause">
                    <label className="control-label"
                           htmlFor={property.timingPause.key}>{property.timingPause.title}</label>
                    <div className="input-container">
                        <select className={"form-control"} value={property.timingPause.name} onChange={event => this.onChange("timingPause", event)}>
                            {
                                property.timingPause.list.map((option, index) => {
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
                <button className="btn btn-primary pull-right" onClick={() => { this.timingPlanClick('apply') }}><FormattedMessage id='mediaPublish.apply'/></button>
                <button className="btn btn-gray pull-right" onClick={() => { this.timingPlanClick('reset') }}><FormattedMessage id='mediaPublish.reset'/></button>
            </div>
        </div>
    }
}

export default injectIntl(TimingPlan);