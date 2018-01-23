import React,{ PureComponent } from 'react';
import { numbersValid } from '../../util/index';
import moment from 'moment';
import { DatePicker,TimePicker } from 'antd';
import ColorPicker from '../../components/ColorPicker'

import {FormattedMessage,injectIntl, FormattedDate} from 'react-intl';

class PlayerTimeAsset extends PureComponent{
    constructor(props){
        super(props);
        this.state = {
            //计划
            property:{
               //计时素材                
                assetName: { key: "assetName", title: this.props.intl.formatMessage({id:'mediaPublish.materialName'}), placeholder: this.props.intl.formatMessage({id:'mediaPublish.materialName'}), value: "" },             
                timing:{ key: "timing", title: this.props.intl.formatMessage({id:'mediaPublish.timeDirection'}), list: [{ id: 1, name: '倒计时' }, { id: 2, name: '正计时' }], index: 0, name: "倒计时" },
                playDuration: { key: "playDuration", title: this.props.intl.formatMessage({id:'mediaPublish.playDuration'}), placeholder: 's', value: "" },                
                bgColor: { key: 'bgColor', title: this.props.intl.formatMessage({id:'mediaPublish.bgColor'}), value: '#fff' },
                textContent: { key: 'textContent', title: this.props.intl.formatMessage({id:'mediaPublish.textContent'}), value: '' },
                fontType: { key: 'fontType', title: this.props.intl.formatMessage({id:'mediaPublish.selectFont'}), list: [{ id: 1, name: '微软雅黑' }, { id: 2, name: '宋体' }, { id: 3, name: 'serif' }, { id: 4, name: 'monospace' }], index: 0},
                fontSize:{ key: 'fontSize', title: this.props.intl.formatMessage({id:'mediaPublish.fontSize'}), list: [{ id: 1, name: '2pt' }, { id: 2, name: '4pt' }], index: 0},
                fontColor: { key: 'fontColor', title: this.props.intl.formatMessage({id:'mediaPublish.fontColor'}), value: '#000' },
                area:{ key: "area", title: this.props.intl.formatMessage({id:'mediaPublish.areaSet'}), list: [{ id: 1, name: '中国' }, { id: 2, name: '美国' }], index: 0, name: "中国" },
                format: {key: "format", title: this.props.intl.formatMessage({id:'mediaPublish.selectFormat'}), list: [{ id: 1, name: '天+时+分+秒' }, { id: 2, name: '秒+分+时+天' }], index: 0, name: "天+时+分+秒" },
                stopDate: { key: 'stopDate', title: this.props.intl.formatMessage({id:'mediaPublish.lastDate'}), placeholder: '点击选择截止日期', value: moment() },
                stopTime: { key: 'stopTime', title: this.props.intl.formatMessage({id:'mediaPublish.lastTime'}), placeholder: '点击选择截止时间', value: moment() }
            },
            prompt:{
                //计划
                playDuration: false, textContent: false,
            },
        }
        this.onChange = this.onChange.bind(this);
        this.playerTimeAssetClick = this.playerTimeAssetClick.bind(this);
    }


    onChange(id, data) {
        let prompt = false;        
        if(id == "playDuration"||id == "textContent"){
            const val = data.target.value;
            id == "playDuration"?this.setState({
                property: Object.assign({}, this.state.property, { [id]: Object.assign({}, this.state.property[id], { value: val }) }),
                prompt: Object.assign({}, this.state.prompt, { [id]: !numbersValid(val) })
            })
            :this.setState({
                property: Object.assign({}, this.state.property, { [id]: Object.assign({}, this.state.property[id], { value: val }) }),
            })
        }else if(id == "bgColor"||id == "fontColor"||id == "stopDate"||id == "stopTime"){
            this.setState({
                property: Object.assign({}, this.state.property, { [id]: Object.assign({}, this.state.property[id], { value: data }) }),
            })
        }
        else{
            const curIndex = data.target.selectedIndex;
            this.setState({
                property: Object.assign({}, this.state.property, {
                    [id]: Object.assign({}, this.state.property[id], {
                        index: curIndex,
                        name: this.state.property[id].list[curIndex].name
                    })
                })
            })
        }
    }

    playerTimeAssetClick(id) {
        const {} = this.state.property;
        switch (id) {
            case "apply":
                break;
            case "reset":
                break;
        }
    }

    render(){
        const {property, prompt} = this.state;
        console.log(property.stopDate.value)
        return <div className="pro-container playerTimeAsset">
            <div className="row">
                <div className="form-group">
                    <label className="control-label">{property.assetName.title}</label>
                    <div className="input-container input-w-1">
                        <input type="text" className="form-control" disabled="disabled"
                            value={property.assetName.value} />
                    </div>
                </div>
            </div>
            <div className="row">            
                <div className="form-group margin-right-1">
                    <label className="control-label">{property.timing.title}</label>
                    <div className="input-container input-w-3">
                        <select className="form-control" value={property.timing.name}
                            onChange={event => this.onChange("timing", event)}>
                            {
                                property.timing.list.map((option, index) => {
                                    let value = option.name;
                                    return <option key={index} value={value}>
                                        {value}
                                    </option>
                                })}
                        </select>
                    </div>
                </div>
                <div className="form-group margin-right-1">
                    <label className="control-label">{property.playDuration.title}</label>
                    <div className="input-container input-w-3">
                        <input type="text" className="form-control"
                            placeholder={property.playDuration.placeholder} maxLength="8"
                            value={property.playDuration.value}
                            onChange={event => this.onChange("playDuration", event)} />
                        <span className={prompt.playDuration ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>
                    </div>
                </div>
                <div className='form-group'>
                    <label className='control-label'>{property.bgColor.title}</label>
                    <ColorPicker onChange={value=>this.onChange("bgColor",value)} value={property.bgColor.value}/>
                </div>
            </div>
            <div className="row"> 
                <div className='form-group'>
                        <label className='control-label'>{property.textContent.title}</label>
                        <div className="input-container input-w-1 textContent">
                            <input type="text" className="form-control"
                                placeholder={property.textContent.placeholder}
                                value={property.textContent.value}
                                onChange={event => this.onChange("textContent", event)} />
                        </div>
                </div>
            </div>
            <div className="row"> 
                <div className="form-group margin-right-1">
                    <label className="control-label">{property.fontType.title}</label>
                    <div className="input-container input-w-3">
                        <select className="form-control" value={property.fontType.name}
                            onChange={event => this.onChange("fontType", event)}>
                            {
                                property.fontType.list.map((option, index) => {
                                    let value = option.name;
                                    return <option key={index} value={value}>
                                        {value}
                                    </option>
                                })}
                        </select>
                    </div>
                </div>
                <div className="form-group margin-right-1">
                    <label className="control-label">{property.fontSize.title}</label>
                    <div className="input-container input-w-3">
                        <select className="form-control" value={property.fontSize.name}
                            onChange={event => this.onChange("fontSize", event)}>
                            {
                                property.fontSize.list.map((option, index) => {
                                    let value = option.name;
                                    return <option key={index} value={value}>
                                        {value}
                                    </option>
                                })}
                        </select>
                    </div>
                </div>
                <div className='form-group'>
                    <label className='control-label'>{property.fontColor.title}</label>
                    <ColorPicker onChange={value=>this.onChange("fontColor",value)} value={property.fontColor.value}/>
                </div>
            </div>
            <div className="row"> 
                <div className="form-group margin-right-1">
                    <label className="control-label">{property.area.title}</label>
                    <div className="input-container input-w-3">
                        <select className="form-control" value={property.area.name}
                            onChange={event => this.onChange("area", event)}>
                            {
                                property.area.list.map((option, index) => {
                                    let value = option.name;
                                    return <option key={index} value={value}>
                                        {value}
                                    </option>
                                })}
                        </select>
                    </div>
                </div>
                <div className="form-group margin-right-1">
                    <label className="control-label">{property.format.title}</label>
                    <div className="input-container input-w-3">
                        <select className="form-control" value={property.format.name}
                            onChange={event => this.onChange("format", event)}>
                            {
                                property.format.list.map((option, index) => {
                                    let value = option.name;
                                    return <option key={index} value={value}>
                                        {value}
                                    </option>
                                })}
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="isRow"><FormattedMessage id='mediaPublish.singleLine'/></label>
                    <input id="isRow" type="checkbox"/>
                </div>
            </div>
            <div className="row"> 
                <div className="form-group margin-right-1">
                    <label className="control-label">{property.stopDate.title}</label>
                    <div className="input-container input-w-2 datePicker">
                        <DatePicker id="stopDate" format="YYYY-MM-DD" placeholder={property.stopDate.placeholder}
                                    defaultValue={moment()} value={property.stopDate.value} onChange={value => this.onChange('stopDate',value)} />
                        <span className={prompt.stopDate ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>
                    </div>
                </div>
                <div className="form-group margin-right-1">
                    <label className="control-label">{property.stopTime.title}</label>
                    <div className="input-container input-w-2 timePicker">
                        <TimePicker size="large" style={{ width: "200px" }} onChange={value => this.onChange("stopTime", value)} defaultValue={moment()} value={property.stopTime.value} placeholder={property.stopTime.placeholder}/> 
                        <span className={prompt.stopTime ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>
                    </div>
                </div>
            </div>
            <div className="row">
                <button className="btn btn-primary pull-right" onClick={() => { this.playerTimeAssetClick('apply') }}><FormattedMessage id='mediaPublish.apply'/></button>
                <button className="btn btn-gray margin-right-1 pull-right" onClick={() => { this.playerTimeAssetClick('reset') }}><FormattedMessage id='mediaPublish.reset'/></button>
            </div>
        </div>
    }
}

export default injectIntl(PlayerTimeAsset)