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
        const {name, width, height, axisX, axisY, playEndIndex} = props.data;
        this.state = {
            property: {
                //区域
                areaName: {
                    key: "areaName",
                    title: this.props.intl.formatMessage({id: 'mediaPublish.areaName'}),
                    placeholder: this.props.intl.formatMessage({id: 'mediaPublish.areaName'}),
                    defaultValue: name ? name : "",
                    value: name ? name : ""
                },
                width: {
                    key: "width",
                    title: this.props.intl.formatMessage({id: 'mediaPublish.areaWidth'}),
                    placeholder: '请输入宽度',
                    defaultValue: width ? width : 0,
                    value: width ? width : 0
                },
                height: {
                    key: "height",
                    title: this.props.intl.formatMessage({id: 'mediaPublish.areaHeight'}),
                    placeholder: '请输入高度',
                    defaultValue: height ? height : 0,
                    value: height ? height : 0
                },
                axisX_a: {
                    key: "axisX_a",
                    title: this.props.intl.formatMessage({id: 'mediaPublish.x'}),
                    placeholder: '请输入X轴坐标',
                    defaultValue: axisX ? axisX : 0,
                    value: axisX ? axisX : 0
                },
                axisY_a: {
                    key: "axisY_a",
                    title: this.props.intl.formatMessage({id: 'mediaPublish.y'}),
                    placeholder: '请输入Y轴坐标',
                    defaultValue: axisY ? axisY : 0,
                    value: axisY ? axisY : 0
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
                areaName: name ? false : true, width: true, height: true, axisX_a: true, axisY_a: true,
            }
        }

        this.onChange = this.onChange.bind(this);
        this.playerAreaClick = this.playerAreaClick.bind(this);
        this.updatePlayEnd = this.updatePlayEnd.bind(this);
        this.initProperty = this.initProperty.bind(this);
    }

    componentWillMount() {
        this.mounted = true;
        const {projectId, parentId, parentParentId, data} = this.props;
        if(!data){
            return;
        }

        const index = lodash.findIndex(this.state.property.playEnd.list, mode=>{ return mode.type == data.lastFrame});
        this.updatePlayEnd(index);
        if(projectId && parentId && parentParentId && data.id && (typeof data.id == "number" || data.id.indexOf("area&&")) < 0){
            getZoneById(projectId, parentId, parentParentId, data.id, data=> {
                this.mounted && this.initProperty(data)
            });
        }
    }

    componwntWillUnmount() {
        this.mounted = false;
    }

    initProperty(data) {
        const playEndList = this.state.property.playEnd.list;
        const playEndIndex = lodash.findIndex(playEndList, item=> {
            return item.type = data.lastFrame;
        })
        this.state.property.areaName.defaultValue = this.state.property.areaName.value = data.name;
        this.state.property.width.defaultValue = this.state.property.width.value = data.width;
        this.state.property.height.defaultValue = this.state.property.height.value = data.height;
        this.state.property.axisX_a.defaultValue = this.state.property.axisX_a.value = data.axisX;
        this.state.property.axisY_a.defaultValue = this.state.property.axisY_a.value = data.axisY;

        this.updatePlayEnd(playEndIndex);
        this.setState({
            property: Object.assign({}, this.state.property),
            prompt: {
                areaName: data.name ? false : true,
                width: data.width ? false : true,
                height: data.height ? false : true,
                axisX_a: data.axisX ? false : true,
                axisY_a: data.axisY ? false : true
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
                x: property.axisX_a.value,
                y: property.axisY_a.value,
                w: property.width.value,
                h: property.height.value
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
        console.log(id);
        switch (id) {
            case "apply":
                this.applyHandler();
                break;
            case "reset":
                this.resetHandler();
                break;
        }
    }

    onChange(id, value) {
        console.log("id:", id);
        let prompt = false;

        const val = value.target.value;
        if (id == "playEnd") {
            const selectIndex = value.target.selectedIndex;
            this.setState({
                property: Object.assign({}, this.state.property, {
                    [id]: Object.assign({}, this.state.property[id], {
                        index: selectIndex,
                        name: this.state.property[id].list[selectIndex].name
                    })
                })
            })
            return;
        }
        else if (id == "areaName") {
            if (!Name2Valid(val)) {
                prompt = true;
            }
        } else {
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
        console.log(property.width);
        return <div className={"pro-container playerArea "}>
            <div className="row">
                <div className="form-group  area-name">
                    <label className="control-label"
                           htmlFor={property.areaName.key}>{property.areaName.title}</label>
                    <div className="input-container input-w-1">
                        <input type="text" className={"form-control "}
                               placeholder={property.areaName.placeholder} maxLength="8"
                               value={property.areaName.value}
                               onChange={event => this.onChange("areaName", event)}/>
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
                        <input type="text" className={"form-control "}
                               placeholder={property.width.placeholder} maxLength="8"
                               value={property.width.value}
                               onChange={event => this.onChange("width", event)}/>
                        <span className={prompt.width ? "prompt " : "prompt hidden"}><FormattedMessage
                            id='mediaPublish.check'/></span>
                    </div>
                </div>
                <div className="form-group  pull-right height">
                    <label className="col-sm-3 control-label"
                           htmlFor={property.height.key}>{property.height.title}</label>
                    <div className="input-container input-w-2">
                        <input type="text" className={"form-control "}
                               placeholder={property.height.placeholder} maxLength="8"
                               value={property.height.value}
                               onChange={event => this.onChange("height", event)}/>
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
                        <input type="text" className={"form-control "}
                               placeholder={property.axisX_a.placeholder} maxLength="8"
                               value={property.axisX_a.value}
                               onChange={event => this.onChange("axisX_a", event)}/>
                    <span className={prompt.axisX_a ? "prompt " : "prompt hidden"}><FormattedMessage
                        id='mediaPublish.check'/></span>
                    </div>
                </div>
                <div className="form-group  pull-right axisY_a">
                    <label className="col-sm-3 control-label"
                           htmlFor={property.axisY_a.key}>{property.axisY_a.title}</label>
                    <div className="input-container input-w-2">
                        <input type="text" className={"form-control "}
                               placeholder={property.axisY_a.placeholder} maxLength="8"
                               value={property.axisY_a.value}
                               onChange={event => this.onChange("axisY_a", event)}/>
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
                        <select className={"form-control"} value={property.playEnd.name}
                                onChange={event => this.onChange("playEnd", event)}>
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