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

import {treeViewInit} from '../../common/actions/treeView';
import {overlayerShow, overlayerHide} from '../../common/actions/overlayer';

import PlayerScenePopup from '../component/PlayerScenePopup';
import PlayerPlanPopup from '../component/PlayerPlanPopup';
import PlayerAreaPopup from '../component/PlayerAreaPopup';
import Material from '../component/material';

import moment from 'moment'
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
                list: [{id: 1, name: '素材1', active:true}, {id: 2, name: '素材2'},{id: 3, name: '素材3'}, {id: 4, name: '素材4'},
                    {id: 5, name: '素材5'}, {id: 6, name: '素材6'}], index: 0, name: '素材1'
            }),
            assetList: Immutable.fromJS({list: [{id: 1, name: '素材1', active:true}, {id: 2, name: '素材2'},{id:3, name:'素材3'},
                {id:4, name:'素材4'}/*,{id:5, name:'素材5'},{id:6, name:'素材6'}*/], index: 0, name: '素材1'}),

            property: {
                areaName: {key: "areaName", title: "动作", list:[{id:1, name:'动作1'},{id:2, name:'动作2'}], index:0, name: ""},
                axisX: {key: "axisX", title: "X轴", placeholder: "输入X轴", value: ""},
                axisY: {key: "axisY", title: "Y轴", placeholder: "输入Y轴", value: ""},
                speed: {key: "speed", title: "速度", placeholder: "fps(1-100)", value: ""},
                repeat: {key: "repeat", title: "重复次数", placeholder: "1-255", value: ""},
                resTime: {key: "resTime", title: "停留时间", placeholder: "ms", value: ""},
                flicker: {key: "flicker", title: "闪烁次数", placeholder: "1-255", value: ""},
            },
            page: Immutable.fromJS({
                pageSize: 10,
                current: 1,
                total: 2
            }),
            prompt: {
                areaName: false,
                speed: false,
                repeat: false,
                resTime: false,
                flicker: false,
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
            showModal:false,


        }

        this.typeList = [{id:1, name:'播放计划'},{id:2, name:'场景'},{id:3, name:"区域"}]

        this.onChange = this.onChange.bind(this);
        this.addHandler = this.addHandler.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.playHandler = this.playHandler.bind(this);
        this.saveHandler = this.saveHandler.bind(this);
        this.savePlanHandler = this.savePlanHandler.bind(this);
        this.quitHandler = this.quitHandler.bind(this);
        this.areaClick = this.areaClick.bind(this);

        this.updatePlayerPlan = this.updatePlayerPlan.bind(this);
        this.showModal=this.showModal.bind(this);
        this.hideModal=this.hideModal.bind(this);
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

    areaClick(id){
        const {actions} = this.props;
        let data = {}
        if(id == "add"){
            data.typeList = this.typeList;
            data.sceneName = '';
            actions.overlayerShow(<PlayerScenePopup title="添加计划/场景/区域" data={data} onCancel={()=>{ actions.overlayerHide()}} onConfirm={()=>{
            // data.sceneName = '';
            // data.width = 1920;
            // data.height = 1080;
            // data.axisX = 10;
            // data.axisY = 10;
            //     actions.overlayerShow(<PlayerPlanPopup title="添加计划/场景/区域" data={data} onCancel={()=>{actions.overlayerHide()}} onConfirm={()=>{
            //
            //     }}/>)
                data.sceneName = '';
                data.startDate = moment();
                data.endDate = moment();
                data.startTime = moment();
                data.endTime = moment();
                data.week = [1,0,1,0,0,0,0];
                actions.overlayerShow(<PlayerAreaPopup title="添加计划/场景/区域" data={data} onCancel={()=>{actions.overlayerHide()}} onConfirm={()=>{

                }}/>)
            }}/>)
        }else{

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
    showModal(){
        this.setState({
            showModal:true
        })
    }
    hideModal(){
        this.setState({
            showModal:false
        })
    }
    render() {
        const {playerData, playerListAsset, assetList, property, prompt, assetType, assetSort, assetSearch, page} = this.state;

        return <div className={"container "+"mediaPublish-playerArea"}>
            <HeadBar moduleName="媒体发布" router={this.props.router}/>
            <SideBar data={playerData} onClick={this.areaClick} onToggle={this.onToggle}/>
            <Content className="player-area">
                <div className="left">
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
                <div className="right">
                    <div className="pro-title">属性</div>
                    <div className="pro-container">
                        <div className="row">
                            <div className="form-group  area-name">
                                <label className="control-label" htmlFor={property.areaName.key}>{property.areaName.title}</label>
                                <div className="input-container">
                                    <select className={ "form-control" }  value={ property.areaName.value } onChange={ event=>this.onChange("areaName", event) }>
                                        {
                                            property.areaName.list.map((option, index) => {
                                            let value = option.name;
                                            return <option key={ index } value={ value }>
                                                { value }
                                            </option>
                                        }) }
                                    </select>
                                    <span className={prompt.area?"prompt ":"prompt hidden"}>{"仅能使用字母、数字或下划线"}</span>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group axis-X">
                                <label className="control-label"
                                       htmlFor={property.axisX.key}>{property.axisX.title}</label>
                                <div className="input-container">
                                    <input type="text" className={ "form-control " }
                                           placeholder={property.axisX.placeholder} maxLength="8"
                                           value={property.axisX.value}
                                           onChange={event=>this.onChange("width", event)}/>
                                    <span className={prompt.axisX?"prompt ":"prompt hidden"}>{"仅能使用字母、数字或下划线"}</span>
                                </div>
                            </div>
                            <div className="form-group speed">
                                <label className="control-label"
                                       htmlFor={property.speed.key}>{property.speed.title}</label>
                                <div className="input-container">
                                    <input type="text" className={ "form-control " }
                                           placeholder={property.speed.placeholder} maxLength="8"
                                           value={property.speed.value}
                                           onChange={event=>this.onChange("speed", event)}/>
                                    <span className={prompt.speed?"prompt ":"prompt hidden"}>{"仅能使用字母、数字或下划线"}</span>
                                </div>
                            </div>
                            <div className="form-group repeat">
                                <label className="control-label"
                                       htmlFor={property.repeat.key}>{property.repeat.title}</label>
                                <div className="input-container">
                                    <input type="text" className={ "form-control " }
                                           placeholder={property.repeat.placeholder} maxLength="8"
                                           value={property.repeat.value}
                                           onChange={event=>this.onChange("repeat", event)}/>
                                    <span className={prompt.repeat?"prompt ":"prompt hidden"}>{"仅能使用字母、数字或下划线"}</span>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group axisY">
                                <label className="col-sm-3 control-label"
                                       htmlFor={property.axisY.key}>{property.axisY.title}</label>
                                <div className="input-container">
                                    <input type="text" className={ "form-control " }
                                           placeholder={property.axisY.placeholder} maxLength="8"
                                           value={property.axisY.value}
                                           onChange={event=>this.onChange("axisY", event)}/>
                                    <span className={prompt.axisY?"prompt ":"prompt hidden"}>{"仅能使用字母、数字或下划线"}</span>
                                </div>
                            </div>
                            <div className="form-group resTime">
                                <label className="control-label"
                                       htmlFor={property.resTime.key}>{property.resTime.title}</label>
                                <div className="input-container">
                                    <input type="text" className={ "form-control " }
                                           placeholder={property.resTime.placeholder} maxLength="8"
                                           value={property.resTime.value}
                                           onChange={event=>this.onChange("resTime", event)}/>
                                    <span className={prompt.resTime?"prompt ":"prompt hidden"}>{"仅能使用字母、数字或下划线"}</span>
                                </div>
                            </div>
                            <div className="form-group flicker">
                                <label className="control-label"
                                       htmlFor={property.flicker.key}>{property.flicker.title}</label>
                                <div className="input-container">
                                    <input type="text" className={ "form-control " }
                                           placeholder={property.flicker.placeholder} maxLength="8"
                                           value={property.flicker.value}
                                           onChange={event=>this.onChange("flicker", event)}/>
                                    <span className={prompt.flicker?"prompt ":"prompt hidden"}>{"仅能使用字母、数字或下划线"}</span>
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
                            <button className="btn btn-primary add" onClick={this.showModal}>添加</button>
                            <button className="btn btn-primary">编辑</button>
                            {this.state.showModal?<Material showModal={this.state.showModal} hideModal={this.hideModal}/>:null}
                        </div>
                        <div className="bottom">
                            <ul className="asset-list">
                                {
                                    assetList.get('list').map((item,index)=> {
                                        return <li key={item.get('id')}  className={index>0&&index%4==0?"margin-right":""}>
                                            <div className={"background "+(item.get('active')?'':'hidden')}></div>
                                            <span className="icon"></span>
                                            <span className="name">{item.get('name')}</span>
                                        </li>
                                    })
                                }
                            </ul>
                            <div className="page-container">
                                <Page className={"page "+(page.get('total')==0?"hidden":"")} showSizeChanger pageSize={page.get('pageSize')}
                                  current={page.get('current')} total={page.get('total')} onChange={this.pageChange}/>
                            </div>
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
                                <div className={"background "+(item.get('active')?'':'hidden')}></div>
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