/**
 * Created by a on 2017/10/20.
 */
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import '../../../public/styles/mediaPublish-playList.less';

import HeadBar from '../../components/HeadBar'
import SideBar from '../component/SideBar'
import Overlayer from '../../common/containers/Overlayer'

import Content from '../../components/Content';
import Select from '../../components/Select';
import SearchText from '../../components/SearchText';
import Page from '../../components/Page';

import {treeViewInit} from '../../common/actions/treeView'
import {overlayerShow, overlayerHide} from '../../common/actions/overlayer'
import Immutable from 'immutable';
export class PlayerArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playerData: [
                {
                    "id": "player1",
                    "name": "播放计划1",
                    "toggled": false,
                    "active": true,
                    "level": 1,
                    "children": [
                        {
                            "id": 'scene1',
                            "name": "场景1",
                            "toggled": true,
                            "class": "",
                            "active": false,
                            "children": [
                                {
                                    "id": 'area1',
                                    "name": "区域1",
                                    "active": false,
                                }, {
                                    "id": 'area2',
                                    "name": "区域2",
                                    "active": false,
                                }
                            ]
                        },
                        {
                            "id": 'scene2',
                            "name": "场景2",
                            "toggled": false,
                            "class": "",
                            "active": false
                        }
                    ]
                },
                {
                    "id": "player2",
                    "name": "播放计划2",
                    "toggled": false,
                    "active": true,
                    "level": 1
                },
                {
                    "id": "player3",
                    "name": "播放计划3",
                    "toggled": false,
                    "active": true,
                    "level": 1
                }
            ],
            playerListAsset: Immutable.fromJS({
                list: [{id: 1, name: '素材1'}, {id: 2, name: '素材2'}],
                index: 0,
                name: '素材1'
            }),
            assetList: Immutable.fromJS({list: [{id: 1, name: '素材1'}, {id: 2, name: '素材2'}], index: 0, name: '素材1'}),

            property: {
                areaName: {key: "areaName", title: "动作", placeholder: "输入区域名称", value: ""},
                width: {key: "width", title: "宽度：", placeholder: "输入宽度", value: ""},
                height: {key: "height", title: "高度：", placeholder: "输入高度", value: ""},
                axisX: {key: "axisX", title: "X轴：", placeholder: "输入X轴", value: ""},
                axisY: {key: "axisY", title: "Y轴：", placeholder: "输入Y轴", value: ""}
            },
            page: Immutable.fromJS({
                pageSize: 10,
                current: 1,
                total: 2
            }),
            prompt: {
                area: false,
                width: false,
                height: false,
                axisX: false,
                axisY: false,
            },
            assetType: Immutable.fromJS({list: [{id: 1, value: '类别1'}, {id: 2, value: '类别2'}], index: 0, value: '类别1'}),
            assetSort: Immutable.fromJS({
                list: [{id: 1, value: '素材文字'}, {id: 2, value: '素材图片'}],
                index: 0,
                value: '素材文字'
            }),
            assetSearch: Immutable.fromJS({placeholder: '输入素材名称', value: ''}),
        }

        this.onChange = this.onChange.bind(this);
        this.addHandler = this.addHandler.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.playHandler = this.playHandler.bind(this);
        this.saveHandler = this.saveHandler.bind(this);
        this.savePlanHandler = this.savePlanHandler.bind(this);
        this.quitHandler = this.quitHandler.bind(this);

        this.updatePlayerPlan = this.updatePlayerPlan.bind(this);
    }

    componentWillMount() {
        this.updatePlayerPlan();
    }

    updatePlayerPlan() {
        const {playerData} = this.state;
        this.props.actions.treeViewInit(playerData);
    }

    onChange(id, value) {
        if (id == "playerList" || id == "sceneList" || id == "assetType" || id == "assetSort") {
            this.state[id] = this.state[id].update('index', v=>value);
            this.setState({[id]: this.state[id].update('value', v=>this.state[id].getIn(["list", value, "value"]))});
        }
        else if (id == "assetSearch") {
            this.setState({assetSearch: this.state.assetSearch.update('value', v=>value)});
        } else {
            const val = value.target.value;
            this.setState({property: Object.assign({}, this.state.property, {[id]: Object.assign({}, this.state.property[id], {value: val})})})
        }
    }

    playHandler() {

    }

    saveHandler() {

    }

    savePlanHandler() {

    }

    quitHandler() {

    }

    addHandler() {

    }

    searchSubmit() {

    }

    render() {
        const {playerData, playerListAsset, assetList, property, prompt, assetType, assetSort, assetSearch, page} = this.state;

        return <div className={"container "+"mediaPublish-playerArea"}>
            <HeadBar moduleName="媒体发布" router={this.props.router}/>
            <SideBar data={playerData} onToggle={this.onToggle}/>
            <Content className="player-area">
                <div className="left col-sm-5">
                    <div className="control-container-top">
                        <div className="play-container" onClick={()=>this.playHandler()}><span
                            className="play"></span><span>播放</span></div>
                        <div className="zoom-out-container" onClick={()=>this.zoomOutHandler()}>
                            <span></span><span>放大</span></div>
                        <div className="zoom-in-container" onClick={()=>this.zoomInHandler()}>
                            <span></span><span>缩小</span></div>
                    </div>
                    <div className="img-container">
                        <img src=""/>
                    </div>
                    <div className="control-container-bottom">
                        <div className="pull-right quit-container " onClick={()=>this.quitHandler()}><span></span><span>退出</span>
                        </div>
                        <div className="pull-right save-plan-container " onClick={()=>this.savePlanHandler()}><span
                            className="save-plan"></span><span>保存计划</span></div>
                    </div>
                </div>
                <div className="right col-sm-7">
                    <div className="pro-title">属性</div>
                    <div className="pro-container">
                        <div className="form-group row area-name">
                            <label className="col-sm-3 control-label"
                                   htmlFor={property.areaName.key}>{property.areaName.title}</label>
                            <div className="col-sm-9">
                                <input type="text" className={ "form-control" }
                                       placeholder={property.areaName.placeholder} maxLength="16"
                                       value={property.areaName.value}
                                       onChange={event=>this.onChange("areaName", event)}/>
                                <span className={prompt.area?"prompt ":"prompt hidden"}>{"仅能使用字母、数字或下划线"}</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-sm-6">
                                <label className="col-sm-3 control-label"
                                       htmlFor={property.width.key}>{property.width.title}</label>
                                <div className="col-sm-9">
                                    <input type="text" className={ "form-control " }
                                           placeholder={property.width.placeholder} maxLength="8"
                                           value={property.width.value}
                                           onChange={event=>this.onChange("width", event)}/>
                                    <span className={prompt.width?"prompt ":"prompt hidden"}>{"仅能使用字母、数字或下划线"}</span>
                                </div>
                            </div>
                            <div className="form-group col-sm-6">
                                <label className="col-sm-3 control-label"
                                       htmlFor={property.height.key}>{property.height.title}</label>
                                <div className="col-sm-9">
                                    <input type="text" className={ "form-control " }
                                           placeholder={property.height.placeholder} maxLength="8"
                                           value={property.height.value}
                                           onChange={event=>this.onChange("height", event)}/>
                                    <span className={prompt.height?"prompt ":"prompt hidden"}>{"仅能使用字母、数字或下划线"}</span>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-sm-6">
                                <label className="col-sm-3 control-label"
                                       htmlFor={property.axisX.key}>{property.axisX.title}</label>
                                <div className="col-sm-9">
                                    <input type="text" className={ "form-control " }
                                           placeholder={property.axisX.placeholder} maxLength="8"
                                           value={property.axisX.value}
                                           onChange={event=>this.onChange("axisX", event)}/>
                                    <span className={prompt.axisX?"prompt ":"prompt hidden"}>{"仅能使用字母、数字或下划线"}</span>
                                </div>
                            </div>
                            <div className="form-group col-sm-6">
                                <label className="col-sm-3 control-label"
                                       htmlFor={property.axisY.key}>{property.axisY.title}</label>
                                <div className="col-sm-9">
                                    <input type="text" className={ "form-control " }
                                           placeholder={property.axisY.placeholder} maxLength="8"
                                           value={property.axisY.value}
                                           onChange={event=>this.onChange("axisY", event)}/>
                                    <span className={prompt.axisY?"prompt ":"prompt hidden"}>{"仅能使用字母、数字或下划线"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="asset-lib">素材库</div>
                    <div className="asset-container">
                        <div className="top">
                            <Select className="asset-type" data={assetType}
                                    onChange={selectIndex=>this.onChange("assetType", selectIndex)}></Select>
                            <Select className="asset-sort" data={assetSort}
                                    onChange={selectedIndex=>this.onChange("assetSort", selectedIndex)}></Select>
                            <SearchText className="asset-search" placeholder={assetSearch.get('placeholder')}
                                        value={assetSearch.get('value')}
                                        onChange={value=>this.onChange("assetSearch", value)}
                                        submit={this.searchSubmit}></SearchText>
                            <button className="btn btn-primary add">添加</button>
                            <button className="btn btn-primary">编辑</button>
                        </div>
                        <div className="bottom">
                            <ul className="asset-list">
                                {
                                    assetList.get('list').map(item=> {
                                        return <li key={item.id}>
                                            <div className="background"></div>
                                            <span className="icon"></span>
                                            <span className="name">{item.get('name')}</span>
                                        </li>
                                    })
                                }
                            </ul>

                            <Page className={"page "+(page.get('total')==0?"hidden":"")} showSizeChanger pageSize={page.get('pageSize')}
                                  current={page.get('current')} total={page.get('total')} onChange={this.pageChange}/>
                        </div>
                    </div>
                </div>
            </Content>
            <div className="mediaPublish-footer">
                <span className="title">播放列表</span>
                <ul>
                    {
                        playerListAsset.get('list').map(item=> {
                            console.log(item.get("name"));
                            return <li key={item.get("id")} className="player-list-asset">
                                <span className="icon"></span>
                                <span className="name">{item.get("name")}</span>
                            </li>
                        })
                    }
                </ul>
                <div className="pull-right control-container">
                    <button className="btn btn-primary">添加</button>
                    <button className="btn btn-primary">编辑</button>
                </div>
            </div>
            <Overlayer />
        </div>
    }
}

const mapStateToProps = state=> {
    return {
        sidebarNode: state.mediaPublish.get('sidebarNode')
    }
}

const mapDispatchToProps = (dispatch)=> {
    return {
        actions: bindActionCreators({
            treeViewInit: treeViewInit,
            overlayerShow: overlayerShow,
            overlayerHide: overlayerHide,
        }, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PlayerArea);