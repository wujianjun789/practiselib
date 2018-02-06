/**
 * Created by a on 2017/11/20.
 */
import React, {PureComponent} from 'react';

import {getZoneById} from '../../api/mediaPublish';

import lodash from 'lodash';
import {Name2Valid, numbersValid} from '../../util/index';

import {FormattedMessage, injectIntl} from 'react-intl';

class PlayerAreaPro extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            property: {
                //区域
                areaName: {
                    key: "areaName",
                    title: this.props.intl.formatMessage({id: 'mediaPublish.areaName'}),
                    placeholder: this.props.intl.formatMessage({id: 'mediaPublish.areaName'}),
                    defaultValue: "",
                    value: ""
                },
                width: {
                    key: "width",
                    title: this.props.intl.formatMessage({id: 'mediaPublish.areaWidth'}),
                    placeholder: '请输入宽度',
                    defaultValue: 0,
                    value: 0
                },
                height: {
                    key: "height",
                    title: this.props.intl.formatMessage({id: 'mediaPublish.areaHeight'}),
                    placeholder: '请输入高度',
                    defaultValue: 0,
                    value: 0
                },
                axisX_a: {
                    key: "axisX_a",
                    title: this.props.intl.formatMessage({id: 'mediaPublish.x'}),
                    placeholder: '请输入X轴坐标',
                    defaultValue: 0,
                    value: 0
                },
                axisY_a: {
                    key: "axisY_a",
                    title: this.props.intl.formatMessage({id: 'mediaPublish.y'}),
                    placeholder: '请输入Y轴坐标',
                    defaultValue: 0,
                    value: 0
                },
                playEnd: {
                    key: "play_end",
                    title: this.props.intl.formatMessage({id: 'mediaPublish.playEnd'}),
                    list: [{id: 1, name: "最后一帧", type: 0}, {id: 1, name: "循环播放", type:1}],
                    defaultIndex: 0,
                    index: 0,
                    name: "最后一帧"
                }
            },
            prompt: {
                //区域
                areaName: true, width: true, height: true, axisX_a: true, axisY_a: true,
            }
        }

        this.onChange = this.onChange.bind(this);
        this.playerAreaClick = this.playerAreaClick.bind(this);
        this.updatePlayEnd = this.updatePlayEnd.bind(this);
        this.init = this.init.bind(this);
        this.initProperty = this.initProperty.bind(this);
    }

    componentWillMount() {
        this.mounted = true;
        this.init();
    }

    componentDidUpdate(){
        this.init();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    init(){
        const {projectId, parentId, parentParentId, data} = this.props;
        if(!data || !data.id || data.id == this.state.id){
            return false;
        }

        if(projectId && parentId && parentParentId && data.id && (typeof data.id == "number" || data.id.indexOf("area&&") < 0)){
            getZoneById(projectId, parentParentId, parentId, data.id, data=> {
                this.mounted && this.initProperty(data);
            });
        }else if(typeof data.id == 'string' && data.id.indexOf("area&&")>-1){
            this.state.property.areaName.defaultValue = this.state.property.areaName.value = data.name;
            this.setState({id:data.id, property: Object.assign({}, this.state.property),
                prompt: {areaName:data.name?false:true}})
        }
    }

    initProperty(data) {
        if(!this.mounted){
            return false;
        }

        const playEndList = this.state.property.playEnd.list;
        const playEndIndex = lodash.findIndex(playEndList, item=> {
            return item.type = data.lastFrame;
        })

        const {x, y, w, h} = data.position;
        this.state.property.areaName.defaultValue = this.state.property.areaName.value = data.name;
        this.state.property.width.defaultValue = this.state.property.width.value = w ? w : 0;
        this.state.property.height.defaultValue = this.state.property.height.value = h ? h : 0;
        this.state.property.axisX_a.defaultValue = this.state.property.axisX_a.value = x ? x : 0;
        this.state.property.axisY_a.defaultValue = this.state.property.axisY_a.value = y ? y : 0;

        this.updatePlayEnd(playEndIndex);
        this.setState({
            id: data.id,
            property: Object.assign({}, this.state.property),
            prompt: {
                areaName: data.name ? false : true,
                width: numbersValid(w) ? false : true,
                height: numbersValid(h) ? false : true,
                axisX_a: numbersValid(x) ? false : true,
                axisY_a: numbersValid(y) ? false : true
            }
        });
    }

    updatePlayEnd(playEndIndex) {
        const playEndList = this.state.property.playEnd.list;
        if (playEndIndex != undefined && playEndIndex > -1 && playEndIndex < playEndList.length) {
            this.state.property.playEnd.defaultIndex = playEndIndex;
            this.state.property.playEnd.index = playEndIndex;
            this.state.property.playEnd.name = playEndList[playEndIndex].name;

            this.setState({property: Object.assign({}, this.state.property)});
        }
    }

    applyHandler = ()=>{
        const {property} = this.state;
        let areaId = this.props.data.id;
        let data = {
            name: property.areaName.value,
            userDefine: '',
            position: {
                x: parseInt(property.axisX_a.value),
                y: parseInt(property.axisY_a.value),
                w: parseInt(property.width.value),
                h: parseInt(property.height.value)
            },
            lastFrame: property.playEnd.list[property.playEnd.index].type
        };

        if(areaId && (typeof areaId == "number" || areaId.indexOf("area&&") < 0)){
            data = Object.assign({}, data, {id:areaId});
        }

        this.props.applyClick && this.props.applyClick(data);
    }

    resetHandler = ()=>{
        for (let key in this.state.property) {
            if (key == "playEnd") {
                this.updatePlayEnd(this.state.property[key].defaultIndex);
            } else {
                this.state.property[key].value = this.state.property[key].defaultValue;
            }
        }

        for (let key in this.state.prompt) {
            const defaultValue = this.state.property[key].defaultValue;
            this.state.prompt[key] = defaultValue ? false : true;
        }

        this.setState({
            property: Object.assign({}, this.state.property),
            prompt: Object.assign({}, this.state.prompt)
        });
    }

    playerAreaClick(id) {
        switch (id) {
            case "apply":
                this.applyHandler();
                break;
            case "reset":
                this.resetHandler();
                break;
        }
    }

    onChange(event) {
        let prompt = false;

        const id = event.target.id;
        const val = event.target.value;
        if (id == "playEnd") {
            const selectIndex = event.target.selectedIndex;
            this.setState({
                property: Object.assign({}, this.state.property, {
                    [id]: Object.assign({}, this.state.property[id], {
                        index: selectIndex,
                        name: this.state.property[id].list[selectIndex].name
                    })
                })
            })
            return false;
        }
        else if (id == "areaName") {
            if (!Name2Valid(val)) {
                prompt = true;
            }
        } else {
            console.log('playerAreaPro：');
            if (!numbersValid(val)) {
                prompt = true;
            }
        }

        this.setState({
            property: Object.assign({}, this.state.property, {[id]: Object.assign({}, this.state.property[id], {value: val})}),
            prompt: Object.assign({}, this.state.prompt, {[id]: prompt})
        })

    }

    render() {
        const {property, prompt} = this.state;
        return <div className={"pro-container playerArea "}>
            <div className="row">
                <div className="form-group  area-name">
                    <label className="control-label"
                           htmlFor={property.areaName.key}>{property.areaName.title}</label>
                    <div className="input-container input-w-1">
                        <input id="areaName" type="text" className={"form-control "}
                               placeholder={property.areaName.placeholder} maxLength="8"
                               value={property.areaName.value}
                               onChange={this.onChange}/>
                        <span className={prompt.areaName ? "prompt " : "prompt hidden"}><FormattedMessage
                            id='mediaPublish.check'/></span>

                    </div>
                </div>
            </div>
            <div className="row">
                <div className="form-group  width">
                    <label className="col-sm-3 control-label"
                           htmlFor={property.width.key}>{property.width.title}</label>
                    <div className="input-container input-w-2">
                        <input id="width" type="text" className={"form-control "}
                               placeholder={property.width.placeholder} maxLength="8"
                               value={property.width.value}
                               onChange={this.onChange}/>
                        <span className={prompt.width ? "prompt " : "prompt hidden"}><FormattedMessage
                            id='mediaPublish.check'/></span>
                    </div>
                </div>
                <div className="form-group  pull-right height">
                    <label className="col-sm-3 control-label"
                           htmlFor={property.height.key}>{property.height.title}</label>
                    <div className="input-container input-w-2">
                        <input id="height" type="text" className={"form-control "}
                               placeholder={property.height.placeholder} maxLength="8"
                               value={property.height.value}
                               onChange={this.onChange}/>
                        <span className={prompt.height ? "prompt " : "prompt hidden"}><FormattedMessage
                            id='mediaPublish.check'/></span>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="form-group  axisX_a">
                    <label className="col-sm-3 control-label"
                           htmlFor={property.axisX_a.key}>{property.axisX_a.title}</label>
                    <div className="input-container input-w-2">
                        <input id="axisX_a" type="text" className={"form-control "}
                               placeholder={property.axisX_a.placeholder} maxLength="8"
                               value={property.axisX_a.value}
                               onChange={ this.onChange}/>
                    <span className={prompt.axisX_a ? "prompt " : "prompt hidden"}><FormattedMessage
                        id='mediaPublish.check'/></span>
                    </div>
                </div>
                <div className="form-group  pull-right axisY_a">
                    <label className="col-sm-3 control-label"
                           htmlFor={property.axisY_a.key}>{property.axisY_a.title}</label>
                    <div  className="input-container input-w-2">
                        <input id="axisY_a" type="text" className={"form-control "}
                               placeholder={property.axisY_a.placeholder} maxLength="8"
                               value={property.axisY_a.value}
                               onChange={this.onChange}/>
                    <span className={prompt.axisY_a ? "prompt " : "prompt hidden"}><FormattedMessage
                        id='mediaPublish.check'/></span>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="form-group pull-right play_end">
                    <label className="col-sm-3 control-label"
                           htmlFor={property.playEnd.key}>{property.playEnd.title}</label>
                    <div className="input-container input-w-2">
                        <select id="playEnd" className={"form-control"} value={property.playEnd.name}
                                onChange={this.onChange}>
                            {
                                property.playEnd.list.map((option, index) => {
                                    let value = option.name;
                                    return <option key={index} value={value}>
                                        {value}
                                    </option>
                                })}
                        </select>
                    </div>
                </div>
            </div>
            <div className="row line"/>
            <div className="row">
                <button className="btn btn-primary pull-right" onClick={() => { this.playerAreaClick('apply') }}>
                    <FormattedMessage id='mediaPublish.apply'/></button>
                <button className="btn btn-gray margin-right-1 pull-right" onClick={() => { this.playerAreaClick('reset') }}>
                    <FormattedMessage id='mediaPublish.reset'/></button>
            </div>
        </div>
    }
}

export default injectIntl(PlayerAreaPro)