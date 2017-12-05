/**
 * Created by a on 2017/11/20.
 */
import React,{ PureComponent } from 'react';

import {getSceneById} from '../../api/mediaPublish';

import lodash from 'lodash';
import { NameValid,numbersValid } from '../../util/index';

import {FormattedMessage,injectIntl, FormattedDate} from 'react-intl';

class PlayerScene extends PureComponent{
    constructor(props){
        super(props);
        const {sceneName, playMode, playModeCount} = props;
        this.state = {
            property: {
                //场景名称
                sceneName: { key: "assetName", title: this.props.intl.formatMessage({id:'mediaPublish.materialName'}), placeholder: this.props.intl.formatMessage({id:'mediaPublish.materialName'}), defaultValue:sceneName?sceneName:"", value: sceneName?sceneName:"" },
                playMode: { key: "playMode", title: this.props.intl.formatMessage({id:'mediaPublish.playingMode'}), list: [{ id: 1, name: "按次播放" }, { id: 2, name: "按时长播放" }, { id: 3, name: "循环播放" }], defaultIndex: 0, index: 0, name: "按次播放" },
                playModeCount: { key: "playModeCount", title: this.props.intl.formatMessage({id:'mediaPublish.repeatTimes'}), placeholder: this.props.intl.formatMessage({id:'mediaPublish.number'}), active: true,
                    defaultValue: playModeCount?playModeCount:"", value: playModeCount?playModeCount:"",
                    defaultValue2: playModeCount?playModeCount:"", value2: playModeCount?playModeCount:""}
            },
            prompt: {
                //场景
                sceneName: sceneName?false:true, /*playMode: playMode?false:true,*/ playModeCount: playModeCount?false:true,
            }
        }

        this.onChange = this.onChange.bind(this);
        this.playerSceneClick = this.playerSceneClick.bind(this);
        this.updatePlayMode = this.updatePlayMode.bind(this);
        this.initProperty = this.initProperty.bind(this);
    }

    componentWillMount(){
        this.mounted = true;
        const {id, playMode} = this.props;
        this.updatePlayMode(playMode);
        getSceneById(id, data=>{this.mounted && this.initProperty(data)})
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    initProperty(data){
        const modeList = this.state.property.playMode.list;
        const modeIndex = lodash.findIndex(modeList, item=>{
            return item.name == data.modeName;
        })
        this.state.property.sceneName.defaultValue = this.state.property.sceneName.value = data.name;
        // this.state.property.playMode.defaultIndex = this.state.property.playMode.index = modeIndex;
        // this.state.property.playMode.name = modeList[modeIndex].name;
        this.updatePlayMode(modeIndex);
        this.state.property.playModeCount.defaultValue = this.state.property.playModeCount.value = data.count;
        this.state.property.playModeCount.defaultValue2 = this.state.property.playModeCount.value2 = data.time;

        this.setState({property: Object.assign({}, this.state.property),
            prompt: {sceneName: data.name?false:true,  playModeCount: (modeIndex==0 && data.count || modeIndex==1 && data.time)?false:true,}})
    }

    updatePlayMode(playMode){
        const playModeList = this.state.property.playMode.list;
        if(playMode != undefined && playMode>-1 && playMode<playModeList.length){
            this.state.property.playMode.defaultIndex = playMode;
            this.state.property.playMode.index = playMode;
            this.state.property.playMode.name = playModeList[playMode].name
            if(playMode==2){
                this.state.property.playModeCount.active = false;
            }else{
                this.state.property.playModeCount.active = true;
            }
            this.setState({property:Object.assign({}, this.state.property)})
        }
    }

    playerSceneClick(id) {
        console.log(id);
        switch (id) {
            case "apply":
                break;
            case "reset":
                for(let key in this.state.property){
                    if(key == "playMode"){
                        this.updatePlayMode(this.state.property[key].defaultIndex);
                    }
                    const defaultValue = this.state.property[key].defaultValue;
                    this.state.property[key].value = defaultValue;
                }

                for(let key in this.state.prompt){
                    const defaultValue2 = this.state.property[key].defaultValue;
                    this.state.prompt[key] = defaultValue2?false:true;
                }
                this.setState({property: Object.assign({}, this.state.property)});
                break;
        }
    }

    onChange(id, value) {
        console.log("id:", id);
        if( id == "playMode"){
            const curIndex = value.target.selectedIndex;
            console.log("correct", curIndex);
            let title = "播放次数";
            let placeholder = '次';
            let active = true;
            let updateId = "playModeCount";
            let prompt = false;
            switch (curIndex) {
                case 0:
                    title = "播放次数";
                    placeholder = "次";
                    if(!numbersValid(this.state.property.playModeCount.value)){
                        prompt = true;
                    }
                    break;
                case 1:
                    title = "播放时长";
                    placeholder = "秒";
                    if(!numbersValid(this.state.property.playModeCount.value2)){
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
                    { [updateId]: Object.assign({}, this.state.property[updateId], { title: title, placeholder: placeholder, active: active }) }),
                prompt: Object.assign({}, this.state.prompt, {playModeCount: prompt})
            })
        }else{
            let prompt = false;

            const val = value.target.value;
            if(id == "sceneName"){
                if (!NameValid(val)) {
                    prompt = true;
                }
            }else{
                if(!numbersValid(val)){
                    prompt = true;
                }
            }
            let valueKey = {}
            if(id == "playModeCount" && this.state.property.playMode.index == 1){
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
        return <div className={"pro-container playerScene "}>
            <div className="row">
                <div className="form-group  scene-name">
                    <label className="control-label"
                           htmlFor={property.sceneName.key}>{property.sceneName.title}</label>
                    <div className="input-container">
                        <input type="text" className={"form-control "}
                               placeholder={property.sceneName.placeholder} maxLength="8"
                               value={property.sceneName.value}
                               onChange={event => this.onChange("sceneName", event)} />
                        <span className={prompt.sceneName ? "prompt " : "prompt hidden"}><FormattedMessage id='mediaPublish.check'/></span>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="form-group">
                    <label className="control-label"
                           htmlFor={property.playMode.key}>{property.playMode.title}</label>
                    <div className="input-container">
                        <select className={"form-control"} value={property.playMode.name} onChange={event => this.onChange("playMode", event)}>
                            {
                                property.playMode.list.map((option, index) => {
                                    let value = option.name;
                                    return <option key={index} value={value}>
                                        {value}
                                    </option>
                                })}
                        </select>
                        {/*<span className={prompt.playMode?"prompt ": "prompt hidden"}>{"请输入正确参数"}</span>*/}
                    </div>
                </div>
                <div className={"form-group " + (property.playModeCount.active ? '' : 'hidden')}>
                    <label className="control-label">{property.playModeCount.title}</label>
                    <div className={"input-container "}>
                        <input type="text" className={"form-control "} htmlFor={property.playModeCount.key} placeholder={property.playModeCount.placeholder} maxLength="8"
                               value={property.playMode.index==0?property.playModeCount.value:property.playModeCount.value2} onChange={event => this.onChange("playModeCount", event)} />
                        <span className={prompt.playModeCount ? "prompt " : "prompt hidden"}><FormattedMessage id='mediaPublish.check'/></span>
                    </div>
                </div>
            </div>
            <div className="row">
                <button className="btn btn-primary pull-right" onClick={() => { this.playerSceneClick('apply') }}><FormattedMessage id='mediaPublish.apply'/></button>
                <button className="btn btn-gray pull-right" onClick={() => { this.playerSceneClick('reset') }}><FormattedMessage id='mediaPublish.reset'/></button>
            </div>
        </div>
    }
}

export default injectIntl(PlayerScene)