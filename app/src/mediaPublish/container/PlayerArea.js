/**
 * Created by a on 2017/10/20.
 */
import React,{Component} from 'react';

import Content from '../../components/Content';
import Select from '../../components/Select';
import SearchText from '../../components/SearchText';
import Material from '../component/material'

import Immutable from 'immutable';
export default class PlayerArea extends Component{
    constructor(props){
        super(props);
        this.state = {
            playerList:Immutable.fromJS({list:[{id:1, value:'播放表1'},{id:2, value:'播放表2'}], index:0, value:'播放表1'}),
            sceneList:Immutable.fromJS({list:[{id:1, value:'场景1'},{id:2, value:'场景2'}], index:0, value:'场景1'}),
            areaList:Immutable.fromJS({list:[{id:1, value:'区域1'},{id:2, value:'区域2'}], index:0, value:'区域1'}),
            property:{
                areaName:{key:"areaName",title:"区域名称：", placeholder:"输入区域名称", value:""},
                width:{key:"width", title:"宽度：", placeholder:"输入宽度", value:""}, height:{key:"height", title:"高度：", placeholder:"输入高度", value:""},
                axisX:{key:"axisX", title:"X轴：", placeholder:"输入X轴", value:""}, axisY:{key:"axisY", title:"Y轴：", placeholder:"输入Y轴", value:""}
            },
            prompt:{
                area:false,
                width: false,
                height: false,
                axisX: false,
                axisY: false,
            },
            assetType:Immutable.fromJS({list:[{id:1, value:'类别1'},{id:2, value:'类别2'}], index:0, value:'类别1'}),
            assetSort:Immutable.fromJS({list:[{id:1, value:'素材文字'},{id:2, value:'素材图片'}], index:0, value:'素材文字'}),
            assetSearch: Immutable.fromJS({placeholder: '输入素材名称', value: ''}),
            showModal:false
        }

        this.onChange = this.onChange.bind(this);
        this.addHandler = this.addHandler.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.playHandler = this.playHandler.bind(this);
        this.saveHandler = this.saveHandler.bind(this);
        this.savePlanHandler = this.savePlanHandler.bind(this);
        this.quitHandler = this.quitHandler.bind(this);
    }

    onChange(id, value){
        if(id=="playerList" || id == "sceneList" || id == "assetType" || id == "assetSort"){
            this.state[id] = this.state[id].update('index', v=>value);
            this.setState({[id]:this.state[id].update('value', v=>this.state[id].getIn(["list", value, "value"]))});
        }
        else if(id == "assetSearch"){
            this.setState({assetSearch:this.state.assetSearch.update('value', v=>value)});
        }else{
            const val = value.target.value;
            this.setState({property:Object.assign({}, this.state.property, {[id]:Object.assign({}, this.state.property[id], {value:val})})})
        }
    }

    playHandler(){

    }

    saveHandler(){

    }

    savePlanHandler(){

    }

    quitHandler(){

    }

    addHandler(){

    }

    searchSubmit(){

    }
    showModal(){
        this.setState({
            showModal:true
        })
        // console.log(this.state.showModal)
    }
    hideModal(){
        this.setState({
            showModal:false
        })
    }
    render(){
        const {playerList, sceneList, areaList, property, prompt, assetType, assetSort, assetSearch} = this.state;
        return <Content className="player-area">
            <div className="left col-sm-3">
                <Select className="player-list" data={playerList} onChange={(selectIndex)=>this.onChange("playerList", selectIndex)}/>
                <Select className="scene" data={sceneList} onChange={(selectIndex)=>this.onChange("sceneList", selectIndex)}></Select>
                <ul>
                    {
                        areaList && areaList.get("list").map(item=>{
                            return <li key={item.get("id")}>{item.get("value")}</li>
                        })
                    }
                </ul>
                <button className="btn btn-primary add-area" onClick={()=>this.addHandler()}>添加区域</button>
            </div>
            <div className="center col-sm-3">
                <div className="col-sm-8 img-container">
                    <img src=""/>
                </div>
                <div className="col-sm-4 pro-container">
                    <button className="btn btn-primary play" onClick={()=>this.playHandler()}>播放</button>
                    <button className="btn btn-primary save" onClick={()=>this.saveHandler()}>存为模板</button>
                    <button className="btn btn-primary save-plan" onClick={()=>this.savePlanHandler()}>保存计划</button>
                    <button className="btn btn-primary quit" onClick={()=>this.quitHandler()}>退出</button>
                </div>
            </div>
            <div className="right col-sm-6">
                <div className="pro-title">属性</div>
                <div className="pro-container">
                    <div className="form-group row area-name">
                        <label className="col-sm-3 control-label" htmlFor={property.areaName.key}>{property.areaName.title}</label>
                        <div className="col-sm-9">
                            <input type="text" className={ "form-control" }  placeholder={property.areaName.placeholder} maxLength="16" value={property.areaName.value}
                                   onChange={event=>this.onChange("areaName", event)}/>
                            <span className={prompt.area?"prompt ":"prompt hidden"}>{"仅能使用字母、数字或下划线"}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-sm-6">
                            <label className="col-sm-3 control-label" htmlFor={property.width.key}>{property.width.title}</label>
                            <div className="col-sm-9">
                                <input type="text" className={ "form-control " }  placeholder={property.width.placeholder} maxLength="8" value={property.width.value}
                                       onChange={event=>this.onChange("width", event)}/>
                                <span className={prompt.width?"prompt ":"prompt hidden"}>{"仅能使用字母、数字或下划线"}</span>
                            </div>
                        </div>
                        <div className="form-group col-sm-6">
                            <label className="col-sm-3 control-label" htmlFor={property.height.key}>{property.height.title}</label>
                            <div className="col-sm-9">
                                <input type="text" className={ "form-control " }  placeholder={property.height.placeholder} maxLength="8" value={property.height.value}
                                       onChange={event=>this.onChange("height", event)}/>
                                <span className={prompt.height?"prompt ":"prompt hidden"}>{"仅能使用字母、数字或下划线"}</span>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-sm-6">
                            <label className="col-sm-3 control-label" htmlFor={property.axisX.key}>{property.axisX.title}</label>
                            <div className="col-sm-9">
                                <input type="text" className={ "form-control " }  placeholder={property.axisX.placeholder} maxLength="8" value={property.axisX.value}
                                       onChange={event=>this.onChange("axisX", event)}/>
                                <span className={prompt.axisX?"prompt ":"prompt hidden"}>{"仅能使用字母、数字或下划线"}</span>
                            </div>
                        </div>
                        <div className="form-group col-sm-6">
                            <label className="col-sm-3 control-label" htmlFor={property.axisY.key}>{property.axisY.title}</label>
                            <div className="col-sm-9">
                                <input type="text" className={ "form-control " }  placeholder={property.axisY.placeholder} maxLength="8" value={property.axisY.value}
                                       onChange={event=>this.onChange("axisY", event)}/>
                                <span className={prompt.axisY?"prompt ":"prompt hidden"}>{"仅能使用字母、数字或下划线"}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="asset-lib">素材库</div>
                <div className="asset-container">
                    <div className="top">
                        <Select className="asset-type" data={assetType} onChange={selectIndex=>this.onChange("assetType", selectIndex)}></Select>
                        <Select className="asset-sort" data={assetSort} onChange={selectedIndex=>this.onChange("assetSort", selectedIndex)}></Select>
                        <SearchText className="asset-search" placeholder={assetSearch.get('placeholder')} value={assetSearch.get('value')}
                                    onChange={value=>this.onChange("assetSearch", value)} submit={this.searchSubmit}></SearchText>
                        <button className="btn btn-primary" onClick={this.showModal.bind(this)}>添加</button>
                    </div>
                    <div>

                    </div>
                </div>
                {this.state.showModal?<Material showModal={this.state.showModal} hideModal={this.hideModal.bind(this)}/>:null}
            </div>

        </Content>
    }
}