import React,{ PureComponent } from 'react';
import { numbersValid } from '../../util/index';
import moment from 'moment';
import { DatePicker } from 'antd';
import { SketchPicker } from 'react-color';

export default class PlayerTimeAsset extends PureComponent{
    constructor(props){
        super(props);
        this.state = {
            //计划
            property:{
               //计时素材                
                assetName: { key: "assetName", title: "素材名称", placeholder: '素材名称', value: "" },                
                timing:{ key: "timing", title: "计时方式", list: [{ id: 1, name: '倒计时' }, { id: 2, name: '正计时' }], index: 0, name: "倒计时" },
                playDuration: { key: "playDuration", title: "播放时长", placeholder: '秒/s', value: "" },                
                bgColor: { key: 'bgColor', title: '背景颜色', value: '#789' },
                textContent: { key: 'textContent', title: '文本内容', value: '' },
                fontType: { key: 'fontType', title: '选择字体', list: [{ id: 1, name: '微软雅黑' }, { id: 2, name: '宋体' }, { id: 3, name: 'serif' }, { id: 4, name: 'monospace' }], index: 0},
                fontSize:{ key: 'fontSize', title: '文字大小', list: [{ id: 1, name: '2pt' }, { id: 2, name: '4pt' }], index: 0},
                fontColor: { key: 'fontColor', title: '文字颜色', value: '#456' },
                area:{ key: "area", title: "区域设置", list: [{ id: 1, name: '中国' }, { id: 2, name: '美国' }], index: 0, name: "中国" },
                format: {key: "format", title: "选择格式", list: [{ id: 1, name: '天+时+分+秒' }, { id: 2, name: '秒+分+时+天' }], index: 0, name: "天+时+分+秒" },
                stopDate: { key: 'stopDate', title: '截止日期', placeholder: '点击选择截止日期', value: '' },
                stopTime: { key: 'stopTime', title: '截止时间', placeholder: '点击选择截止时间', value: '' }
            },
            prompt:{
                //计划
                playTimes: true, clipsRage: true,
            },
            displayFontColorPicker: false,
            displayBgColorPicker: false,
        }
        this.onChange = this.onChange.bind(this);
        this.playerTimeAssetClick = this.playerTimeAssetClick.bind(this);
    }


    onChange(id, value) {
        console.log("id:", id);
        let prompt = false;        
        if(id == "playDuration"||id == "textContent"||id == "bgColor"||id == "fontColor"||id == "stopDate"||id == "stopTime"){
            const val = value.target.value;
            // if (!numbersValid(val)) {
            //     prompt = true;
            // }
    
            this.setState({
                property: Object.assign({}, this.state.property, { [id]: Object.assign({}, this.state.property[id], { value: val }) }),
                prompt: Object.assign({}, this.state.prompt, { [id]: prompt })
            })
        }
        else{
            const curIndex = value.target.selectedIndex;
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

    handleColorClick = (e, type) => {
        e.stopPropagation();
        switch (type) {
            case 'font':
                if (this.fontTarget === undefined) {
                    this.fontTarget = e.target;
                    this.setState({ displayFontColorPicker: !this.state.displayFontColorPicker });
                    return;
                } else {
                    if (this.fontTarget !== e.target) {
                        return;
                    }
                }
                this.setState({ displayFontColorPicker: !this.state.displayFontColorPicker })
                break;
            case 'bg':
                if (this.bgTarget === undefined) {
                    this.bgTarget = e.target;
                    this.setState({ displayBgColorPicker: !this.state.displayBgColorPicker });
                    return;
                } else {
                    if (this.bgTarget !== e.target) {
                        return;
                    }
                }
                this.setState({ displayBgColorPicker: !this.state.displayBgColorPicker })
                break;
            default:
                break;

        }
    };
    handleColorClose = (e, type) => {
        e.stopPropagation();
        switch (type) {
            case 'font':
                this.setState({ displayFontColorPicker: false });
                break;
            case 'bg':
                this.setState({ displayBgColorPicker: false });
                break;
            default:
                break;
        }
    };
    handleColorChange = (color, type) => {
        switch (type) {
            case 'font':
                this.setState({ property: { ...this.state.property, fontColor: { ...this.state.property.fontColor, value: color.hex } } });
                break;
            case 'bg':
                this.setState({ property: { ...this.state.property, bgColor: { ...this.state.property.bgColor, value: color.hex } } });
                break;
            default:
                break;
        }
    };

    render(){
        const {property, prompt} = this.state;
        return <div className="pro-container playerTimeAsset">
            <div className="form-group">
                <label className="control-label">{property.assetName.title}</label>
                <div className="input-container">
                    <input type="text" className="form-control" disabled="disabled"
                        value={property.assetName.value} />
                </div>
            </div>
            <div className="form-group">
                <label className="control-label">{property.timing.title}</label>
                <div className="input-container">
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
            <div className="form-group">
                <label className="control-label">{property.playDuration.title}</label>
                <div className="input-container">
                    <input type="text" className="form-control"
                        placeholder={property.playDuration.placeholder} maxLength="8"
                        value={property.playDuration.value}
                        onChange={event => this.onChange("playDuration", event)} />
                    <span className={prompt.playDuration ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>
                </div>
            </div>
            <div className='form-group'>
                <label className='control-label'>{property.bgColor.title}</label>
                <div className='color-show' style={{ backgroundColor: property.bgColor.value }} onClick={(e)=>this.handleColorClick(e, 'bg')}>
                    {this.state.displayBgColorPicker
                        ? <div className='popover bg-popover'>
                            {<div className='cover' onClick={(e) => this.handleColorClose(e, 'bg')}></div>}
                            <SketchPicker color={property.bgColor.value} onChange={(color) => this.handleColorChange(color, 'bg')} />
                        </div>
                        : null}
                </div>
            </div>
            <div className='form-group'>
                    <label className='control-label'>{property.textContent.title}</label>
                    <div className="input-container textContent">
                        <input type="text" className="form-control"
                            placeholder={property.textContent.placeholder}
                            value={property.textContent.value}
                            onChange={event => this.onChange("textContent", event)} />
                        <span className={prompt.textContent ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>
                    </div>
            </div>
            <div className="form-group">
                <label className="control-label">{property.fontType.title}</label>
                <div className="input-container">
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
            <div className="form-group">
                <label className="control-label">{property.fontSize.title}</label>
                <div className="input-container">
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
                <div className='color-show' style={{ backgroundColor: property.fontColor.value }} onClick={(e) => this.handleColorClick(e, 'font')}>
                    {this.state.displayFontColorPicker
                        ? <div className='popover'>
                            {<div className='cover' onClick={(e) => this.handleColorClose(e, 'font')}></div>}
                            <SketchPicker color={property.fontColor.value} onChange={(color) => this.handleColorChange(color, 'font')} />
                        </div>
                        : null}
                </div>
            </div>
            <div className="form-group">
                <label className="control-label">{property.area.title}</label>
                <div className="input-container">
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
            <div className="form-group">
                <label className="control-label">{property.format.title}</label>
                <div className="input-container">
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
                <label className="control-label" htmlFor="isRow">单行显示</label>
                <input id="isRow" type="checkbox"/>
            </div>
            <div className="form-group">
                <label className="control-label">{property.stopDate.title}</label>
                <div className="input-container datePicker">
                    <DatePicker id="stopDate" showTime format="YYYY-MM-DD" placeholder={property.stopDate.placeholder}
                                defaultValue={moment()} onChange={e => this.onChange('stopDate', e)} />
                    <span className={prompt.stopDate ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>
                </div>
            </div>
            <div className="form-group">
                <label className="control-label">{property.stopTime.title}</label>
                <div className="input-container datePicker">
                    <DatePicker id="stopTime" showTime format="HH:mm:ss" placeholder={property.stopDate.placeholder}
                                defaultValue={moment()} onChange={e => this.onChange('startTime', e)} />
                    <span className={prompt.stopTime ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>
                </div>
            </div>
            <div className="row">
                <button className="btn btn-primary pull-right" onClick={() => { this.playerTimeAssetClick('apply') }}>应用</button>
                <button className="btn btn-gray pull-right" onClick={() => { this.playerTimeAssetClick('reset') }}>重置</button>
            </div>
        </div>
    }
}