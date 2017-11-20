/**
 * Created by a on 2017/11/20.
 */
import React,{ PureComponent } from 'react';

import { NameValid } from '../../util/index';
export default class PlayerScene extends PureComponent{
    constructor(props){
        super(props);

        this.state = {
            property: {
                //场景名称
                sceneName: { key: "assetName", title: "素材名称", placeholder: '素材名称', value: "" },
                playMode: { key: "playMode", title: "播放方式", list: [{ id: 1, name: "按次播放" }, { id: 2, name: "按时长播放" }, { id: 3, name: "循环播放" }], index: 0, name: "按次播放" },
                playModeCount: { key: "playModeCount", title: "播放次数", placeholder: '次', value: "", active: true }
            },
            prompt: {
                //场景
                sceneName: true, playMode: true, playModeCount: true,
            }
        }

        this.onChange = this.onChange.bind(this);
        this.playerSceneClick = this.playerSceneClick.bind(this);
    }

    playerSceneClick(id) {
        console.log(id);
        switch (id) {
            case "apply":
                break;
            case "reset":
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
            let updateId = (id == "playMode") ? "playModeCount" : "timingPlayModeCount";
            switch (curIndex) {
                case 0:
                    title = "播放次数";
                    placeholder = "次";
                    break;
                case 1:
                    title = "播放时长";
                    placeholder = "秒";
                    break;
                case 2:
                    active = false;
                    break;
            }
            this.setState({
                property: Object.assign({}, this.state.property,

                    { [id]: Object.assign({}, this.state.property[id], { index: curIndex, name: this.state.property[id].list[curIndex].name }) },
                    { [updateId]: Object.assign({}, this.state.property[updateId], { title: title, placeholder: placeholder, active: active }) })
            })
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
                        <span className={prompt.sceneName ? "prompt " : "prompt hidden"}>{"请输入名称"}</span>
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
                               value={property.playModeCount.value} onChange={event => this.onChange("playModeCount", event)} />
                        <span className={prompt.playModeCount ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>
                    </div>
                </div>
            </div>
            <div className="row">
                <button className="btn btn-primary pull-right" onClick={() => { this.playerSceneClick('apply') }}>应用</button>
                <button className="btn btn-gray pull-right" onClick={() => { this.playerSceneClick('reset') }}>重置</button>
            </div>
        </div>
    }
}
