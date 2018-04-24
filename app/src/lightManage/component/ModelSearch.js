/**
 * Created by a on 2017/8/24.
 */
import React,{Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';


import {findDOMNode} from 'react-dom'
import Content from '../../components/Content'

import MapView from '../../components/MapView'
import Panel from '../component/FaultPanel'

/*  新增－t  */
import NotifyPopup from '../../common/containers/NotifyPopup'
import {addNotify, removeAllNotify, removeNotify} from '../../common/actions/notifyPopup'
import {getDomainList,getDomainByDomainLevelWithCenter} from '../../api/domain'
import {getObjectByKey} from '../../util/index'
import {getMapConfig} from '../../util/network'
import {getPoleListByModelWithName, getPoleListByModelDomainId, getPoleAssetById} from '../../api/pole'
import {getDomainLevelByMapLevel, getZoomByMapLevel, IsMapCircleMarker} from '../../util/index'
import {getDomainListByName} from '../../api/domain'
import {getIndexByKey} from '../../util/algorithm'
import { injectIntl } from 'react-intl';
import { DOMAIN_LEVEL } from '../../common/util/index'
import {getAssetsBaseByDomain,getSearchAssets,getAssetsBaseById,getAssetsByDomainLevelWithCenter} from '../../api/asset'
import lodash from 'lodash'
import Immutable from 'immutable'
export class ModelSearch extends Component{
    constructor(props){
        super(props);
        this.state = {
            searchOffset:0,
            modifyNow: 0,
            domainSearch:{placeholder:this.props.intl.formatMessage({id:'app.input.device.name'}), value:'', curIndex:-1},
            curList: [],

            /* 新增－20170915 */
            interactive:false,
            tableIndex: 0,
            /*    0:设备;  1:域;    */
            IsSearch: true,
            IsSearchResult: false,
            
            curId:"lamp",
            search:Immutable.fromJS({id:"search", value:''}),
            
            screen:Immutable.fromJS({width:192, height:576, online:1, brightness:100, "brightness_mode":"环境亮度", "switch_power":1, timeTable:"time1", faultList:["sys_fault"]}),
            camera:Immutable.fromJS({"online_people":"50", focus:60, "preset":1, faultList:["vram_fault"]}),
            lamp:Immutable.fromJS({online:1, "switch_power":1, brightness:101, strategy:"strategy1", IsGroup:false, faultList:[]}),
            charge:Immutable.fromJS({"charge_state":1, faultList:["vram_fault"]}),
            collect:Immutable.fromJS({"air-pressure":1000, "temperature":30, "humidity":50, "wind-speed":10, "wind-direction":"东南","pm25":80, "o2":19, "co":5}),

            timeTableList:Immutable.fromJS({id:"timeTable", value:"time1", options:[{id:1, name:"time1"}, {id:2, name:"time2"}]}),
            strategyList:Immutable.fromJS({id:"strategy", value:"strategy1", options:[{id:1, name:"strategy1"}, {id:2, name:"strategy2"}]}),
            faultStyle: {"top": "280px"},
            IsOpenFault: false,
            IsOpenPoleInfo:false,
            IsOpenPoleControl:false,

            /*  新增－t  */
            searchMode:"域",
            resDevice:Immutable.fromJS([{id:1, name:"疏影路灯杆1号", lamp:[]},{id:2, name:"疏影路灯杆2号", screen:23, charge:45, camera:56, lamp:89, collect:99}]),
            resPosition:[{"device_id": 1,"device_type": 'DEVICE', lng: 121.49971691534425, lat: 31.239758843127766},{"device_id": 2,"device_type": 'DEVICE', lng: 121.49971691534425, lat: 31.239658843127756}],
            resDomain:[{}],
            curPosition:[],
            poleList:[],
            curDevice:Immutable.fromJS([]),
            positionList:[],
            searchList:Immutable.fromJS([]),
            isMouseEnter:false
        }

        this.map = {
            center:{ lng: 121.49971691534425, lat: 31.239658843127756 }
        };
        this.listStyle = {"maxHeight":"200px"};
        this.infoStyle = {"maxHeight":"352"};
        this.controlStyle= {"maxHeight":"220"};
        this.domainLevel = DOMAIN_LEVEL+1;
        this.domainCurLevel = 0;

        this.andNot= 0;

        this.screen = Immutable.fromJS({})

        this.lightList = {id:"lightValue",value:"10",options:[
            {id:"1", value:0}, {id:"2", value:10}, {id:"3", value:20}, {id:"4", value:30}, {id:"5", value:40},
            {id:"6", value:50}, {id:"7", value:60}, {id:"9", value:70}, {id:"10", value:80}, {id:"11", value:90}, {id:"12", value:100}
        ]}

        this.screenSwitch = {id:"screenSwitch", value:"关",options:[{id:1, value:"关"},{id:2, value:"开"}]};
        this.lightSwitch = {id:"lightSwitch", value:"关",options:[{id:1, value:"关"},{id:2, value:"开"}]};
        this.presetList = {id:"preset", value:"1",options:[{id:1, value:"1"},{id:2, value:"2"}]};

        this.renderInfo = this.renderInfo.bind(this);
        this.renderState = this.renderState.bind(this);
        this.renderControl = this.renderControl.bind(this);

        this.setSize = this.setSize.bind(this);
        this.onChange = this.onChange.bind(this);
        this.submit = this.submit.bind(this);
        this.backHandler = this.backHandler.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.itemClick = this.itemClick.bind(this);
        this.poleInfoCloseClick = this.poleInfoCloseClick.bind(this);
        this.onToggle = this.onToggle.bind(this);
        this.closeClick = this.closeClick.bind(this);

        /*  新增－t  */
        //this.initDomainList = this.initDomainList.bind(this);
        this.searchInputOnKeyUp=this.searchInputOnKeyUp.bind(this);

        /*  新增－t－20170915  */
        this.searchPromptList = [{id:"device", value:this.props.intl.formatMessage({id:'app.device'})},{id:"domain", value:this.props.intl.formatMessage({id:'app.domain'})}];
        this.requestSearch = this.requestSearch.bind(this);
        this.updateSearch = this.updateSearch.bind(this);
        this.modifyNow = this.modifyNow.bind(this);
        this.searchCancel = this.searchCancel.bind(this);

    }

    componentWillMount(){

        this.mounted = true;
        window.onresize = event => {
            this.mounted && this.setSize();
        }

        getMapConfig(data=>{
                if(this.mounted){
                    this.map = Object.assign({}, this.map, data, { zoomStep:Math.ceil((data.maxZoom-data.minZoom)/this.domainLevel) });
                    this.domainCurLevel = getDomainLevelByMapLevel(this.domainLevel, this.map);
                }
        })
        
    }

    componentDidMount(){
        this.mounted && this.setSize();
    }

    componentWillUnmount(){
        this.mounted = false;
        window.onresize = event=>{
            this.setSize();
        }
        this.props.actions.removeAllNotify();
    }

    /*  新增－t  */
    searchInputOnKeyUp(e){
        if (e.keyCode === 13 || e==="toSearch"){}else{return}
    }


    /*  新增－t－20170915  */
    requestSearch(offset){
        const { search, tableIndex} = this.state;
        let searchType = this.searchPromptList[tableIndex].id;
        let searchValue = search.get("value");
        for(let j=searchValue.length-1;j>0;j--){
			if(searchValue.charAt(j)==' '){}else{
				searchValue=searchValue.substr(0,j+1);
				for(let i=0;i<searchValue.length;i++){
                		if(searchValue.charAt(i)==' '){}else{
                			searchValue=searchValue.substr(i)
                			break;
                		}
                }
				break;
			}
		}
        let offsetV = offset;
        let limitV = 6;
        !offsetV||offsetV<0?offsetV=0:offsetV;
        if(searchType==="domain"){
            getDomainListByName(searchValue,offsetV,limitV,(data)=>{
                let dat = data;
                if(!dat[0]){
                    this.props.actions.addNotify(0, "未找到此搜索域")
                    return;
                }else{
                    this.setState({searchOffset:offsetV},()=>{})
                    this.updateSearch(data,1,'domain')
                }
            })
            return;
        }
        getSearchAssets("","ssslc",searchValue,offsetV,limitV,(data)=>{
            let dat = data;
            if(!dat[0]){}else{
                this.setState({searchOffset:offsetV},()=>{})
                this.mounted && this.updateSearch(data,0,'lamp')
            }
        })
    }

    searchCancel(){
        this.setState({interactive:false,IsSearchResult:false});
    }

    modifyNow(){
        let n = this.state.modifyNow;
        n=n+1;
        this.setState({modifyNow:n});
    }

    updateSearch(data,tableIndex,type){
        let searchType = this.searchPromptList[tableIndex].id;
        let searchList = Immutable.fromJS(data);
        this.setState({searchList:searchList,tableIndex:tableIndex,IsSearchResult:true},()=>{});
    }

    setSize(){
        if(!this.mounted){return;}
        const {IsSearch, curId} = this.state;
        let height = window.innerHeight;
        if(IsSearch){
            this.listStyle = {"maxHeight":(height<145?0:height-145)+"px"};
        }else{
            let defaultHeight = 230;
            if(this.refs.poleInfo){
                defaultHeight += findDOMNode(this.refs.poleInfo).offsetHeight;
            }
            this.infoStyle = {"maxHeight":(height<230?0:height-230)};
            this.controlStyle = {"maxHeight":(height<defaultHeight?0:height-defaultHeight)};
        }
    }

    formatIntl(formatId){
        return formatId;
    }

    onChange(key, event){
        switch (key){
            case "search": //特殊处理
                if (event.target.value){
                    this.setState({search:this.state.search.update("value",v=>event.target.value), interactive:true,IsSearchResult:false});
                }else{
                    this.setState({search:this.state.search.update("value",v=>event.target.value)});
                }
                break;
            case "lightSwitch":
                this.lightSwitch.value = this.lightSwitch.options[event.target.selectedIndex].value;
                this.setState(this.lightSwitch);
                break;
            case "handler":
                this.lightList.value = this.lightList.options[event.target.selectedIndex].value;
                this.setState(this.lightList);
                break;
            default:
        		return false;
        }
    }

    submit(key){
    }

    itemClick(item){
        let curList = [];
        let positionList = [];
        let searchList = '';
        let data = item.toJS();
        let geoPoint = data.geoPoint ? data.geoPoint : {lat:"", lng:""};
        let position = Object.assign(geoPoint, {"device_type":"DEVICE", "device_id":data.id, IsCircleMarker:IsMapCircleMarker(this.domainLevel, this.map)});
        curList.push(data);
        positionList.push(position);
        this.props.handleInfo(curList,positionList,item,this.state.tableIndex,this.state.IsSearchResult);
        this.setState({curList:curList,positionList:positionList,searchList:Immutable.fromJS([item])},()=>{
            if(this.state.tableIndex===0&&this.state.IsSearchResult){
                    //如果是根据设备名称搜索
                    this.setState({IsSearch:false, IsOpenFault:true, interactive:false, IsSearchResult:false, IsOpenPoleInfo:true, IsOpenPoleControl:false},()=>{});
            }else if(this.state.tableIndex===1&&this.state.IsSearchResult){
                    //如果是根据域名称搜索
                    this.setState({IsSearch:true, IsOpenFault:true, interactive:false, IsSearchResult:false, IsOpenPoleInfo:false, IsOpenPoleControl:false},()=>{});
            }else{
                    //如果是点击地图图标
                    if(this.domainCurLevel===5){
                        this.setState({IsSearch:false, IsOpenFault:true, interactive:false, IsSearchResult:false, IsOpenPoleInfo:true, IsOpenPoleControl:false},()=>{});
                    }else if(this.domainCurLevel<5){
                        //如果地图级别是域级别，则向下一个地图级别并显示信息
                        this.setState({IsSearch:true, IsOpenFault:true, interactive:false, IsSearchResult:false, IsOpenPoleInfo:false, IsOpenPoleControl:false},()=>{});
                    }else{}
            }
            this.setSize();
        })
        
    }

    backHandler(){
        this.setState({IsSearch:true,IsSearchResult:true,IsOpenPoleInfo:false}, ()=>{
            this.setSize();
        });
    }

    searchSubmit(index){
        this.setState({interactive:false, tableIndex:index, IsOpenPoleInfo:false, IsOpenPoleControl:false, IsSearch:true},()=>{
            this.requestSearch();
        });
    }

    poleInfoCloseClick(){
        this.setState({IsOpenPoleInfo:false}, ()=>{
            this.setSize();
        })
    }

    onToggle(){
        this.setState({IsOpenPoleControl:!this.state.IsOpenPoleControl});
    }

    closeClick(){
        this.setState({IsOpenFault: false});
    }


    transformState(key, sf){
        if(key === 'wind-direction'){
            return <span className="glyphicon glyphicon-arrow-up" style={{transform:`rotate(${sf}deg)`}}></span>
        }
        if(key === 'brightness_mode'){
            return this.formatIntl(sf ? 'manual' : 'environment-brightness-control');
        }
        if(key === 'online'){
            return this.formatIntl(sf ? '在线' : '离线');
        }
        if(key === 'charge_state'){
            return this.formatIntl(sf ? '充电中' : '充电故障');
        }
        return this.formatIntl(sf ? 'abnormal':'normal');
    }

    renderState(parentPro, key, name, IsTransform, unit){
        if(key === "resolution"){
            if(parentPro && parentPro.has("width") && parentPro.has("height")){
                return <div key={key} className="pro"><span>{name?this.formatIntl(name):key}:</span>{parentPro.get("width")}x{parentPro.get("height")}</div>
            }
        }
        if(parentPro && parentPro.has(key)){
            if(key === 'wind-direction'){
                return <div key={key} className="pro"><span>{name ? this.formatIntl(name):key}:</span>{this.transformState(key, parentPro.get(key))}</div>
            }
            if(key === 'o2'){
                return <div key={key} className="pro"><span>{name ? this.formatIntl(name):key}:</span>{(parentPro.get(key))+(unit ? ' %'+unit:'')}</div>
            }
            return <div key={key} className="pro"><span>{name ? this.formatIntl(name):key}:</span>{(IsTransform ? this.transformState(key, parentPro.get(key)): parentPro.get(key))+(unit ? ' '+unit:'')}</div>
        }
    }

    renderInfo(id, props){
        let faultList = [];
        const {faultStyle, IsOpenFault} = this.state;
        switch(id){
            case "lamp":
                const {lamp} = this.state;
                faultList = lamp.get("faultList").toJS();
                return <div className="row state-info lamp">
                        <div className="col-sm-12 prop">
                            {this.renderState(props, "online", "在线状态", true)}
                            {this.renderState(props, "brightness", "当前亮度")}
                            {
                                faultList.length>0 &&
                                <Panel className={"faultPanel panel-primary "+(IsOpenFault?'':'hidden')} style={faultStyle} title={this.formatIntl('fault_info')} closeBtn={true} closeClick={this.closeClick}>
                                    {
                                        faultList.map(key=>{
                                            return <div key={key}>{this.formatIntl(""+key)}</div>
                                        })
                                    }
                                </Panel>
                            }
                        </div>
                       </div>
        }
    }
    renderControl(id){
        switch(id){
            case "lamp":
                const {strategyList} = this.state;
                return <div className="row state-control lamp">
                        <div className="form-group switch">
                            <label className="apply_label">开关:</label>
                            <select className="form-control" value={this.lightSwitch.value} onChange={event=>this.onChange("lightSwitch", event)}>
						      	{
                                    this.lightSwitch.options.map(sw=>{
                                        return <option key={sw.id}>{sw.value}</option>
                                    })
                                }
						    </select>
                            <button className="btn btn-primary apply_btn" onClick={event=>this.submit("lightSwitch")}>应用</button>
                        </div>
                        <div className="form-group handler">
                            <label className="apply_label">调光:</label>
                            <select className="form-control" value={this.lightList.value} onChange={(event)=>{this.onChange("handler", event)}}>
                                {
                                    this.lightList.options.map(light=>{
                                        return <option key={light.id}>{light.value}</option>
                                    })
                                }
                            </select>
                            <button className="btn btn-primary apply_btn" onClick={event=>this.submit("handler")}>应用</button>
                        </div>
                    </div>
        }
    }

    render(){
        
        const {searchOffset, curList, search, interactive, IsSearch, IsSearchResult, curId, searchList, tableIndex,
            listStyle, infoStyle, controlStyle, positionList,  IsOpenPoleInfo, IsOpenPoleControl} = this.state;
        let IsControl = false;
        let searchListToJS = searchList.toJS();
        let searchListLength = searchListToJS.length;
        if(curId==="screen" || curId==="lamp" || curId==="camera"){
            IsControl = true;
        }
        return (
                <div className="search-container" onMouseLeave={()=>{}} onMouseEnter={()=>{}}>
                    <div className="input-group searchBlock">
                        <input type="search" ref="searchInput" className="form-control" placeholder={ this.state.domainSearch.placeholder } defaultValue={''} onKeyUp={(event)=>{this.searchInputOnKeyUp(event)}} onChange={(event)=>{this.onChange("search",event)}}/>
                        <span className="glyphicon glyphicon-search form-control-feedback" aria-hidden="true"></span>
                        <span className={"cancel-control "+(interactive||IsSearchResult?'active':'')} onClick={()=>{this.searchCancel()}} role="cancel-control">cancel</span>
                    </div>
                    <ul className={"list-group mode-select "+(interactive?'select-active':'')}>
                            {
                                this.searchPromptList.map((item, index)=>{
                                    return <li className={"list-group-item "+(index===tableIndex?"":"")} key={index} value={item.value} onClick={()=>this.searchSubmit(index)} role="button">{item.value}<span></span> {search.get("value")}</li>
                                })
                            }
                    </ul>
                    <ul className={"list-group "+(IsSearch&&IsSearchResult?"":"hidden")} style={this.listStyle}>
                        {
                            searchList.map((item,key)=>{
                                if(searchListLength === (key+1)){
                                    return <li key={item.get("id")} className="list-group-item" onClick={()=>this.itemClick(item)} role="button">
                                        {item.get("name")}
                                        {item.getIn(["extendType","ssslc"]) && <span className=""><svg><use xlinkHref={"#icon_led_light"} transform="scale(0.08,0.08)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg></span>}
                                    </li>
                                }else{
                                    return <li key={item.get("id")} className="list-group-item" onClick={()=>this.itemClick(item)} role="button">
                                        {item.get("name")}
                                        {item.getIn(["extendType","ssslc"]) && <span className=""><svg><use xlinkHref={"#icon_led_light"} transform="scale(0.08,0.08)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg></span>}
                                    </li>
                                }
                            })
                        }
                    </ul>
                    <div className={"prevNext "+(IsSearch&&IsSearchResult?"":"hidden")}><span className="next" onClick={()=>{ let num=searchOffset+6; this.requestSearch(num); }} role="next"></span><span className="prev" onClick={()=>{ let num=searchOffset-6; this.requestSearch(num); }} role="prev"></span></div>
                    <div className={"margin-top margin-bottom search-back "+(IsSearch?"hidden":"")} style={{"marginBottom":(this.infoStyle.maxHeight>0?15:0)+"px"}}
                        onClick={this.backHandler} role="back-handler">
                        <span className="glyphicon glyphicon-menu-left padding-left padding-right"></span>
                        <span className="name">{this.props.intl.formatMessage({id:'app.search.list'})}</span>
                    </div>
                    <div ref="poleInfo" id="poleInfo" className={"panel panel-info pole-info "+(IsOpenPoleInfo?"":"hidden")}
                         style={Object.assign({"marginBottom":(this.controlStyle.maxHeight>0?20:0)+"px"},{"maxHeight":this.infoStyle.maxHeight+"px"})}>
                        <div className={"panel-heading "+(this.infoStyle.maxHeight===0?"hidden":"")} style={{"maxHeight":(this.infoStyle.maxHeight>40?40:this.infoStyle.maxHeight)+"px"}}>
                            <h3 className={"panel-title "+(this.infoStyle.maxHeight<30?"hidden":"")}>{searchListToJS[0]?searchListToJS[0].name:''}<span className={"close"} onClick={()=>this.poleInfoCloseClick()}>&times;</span></h3>
                        </div>
                        <div className={"panel-body "+(this.infoStyle.maxHeight<40?"hidden":"")} style={{"maxHeight":(this.infoStyle.maxHeight>40?this.infoStyle.maxHeight-40:0)+"px"}}>
                            { this.renderInfo(curId,this.state[curId]) }
                        </div>
                    </div>
                    <div className={"panel panel-info pole-control "+(IsSearch || !IsControl || this.controlStyle.maxHeight===0?"hidden":"")} style={{"maxHeight":this.controlStyle.maxHeight+"px"}}>
                        <div className={"panel-heading "+(this.controlStyle.maxHeight===0?"hidden":"")} style={{"maxHeight":(this.controlStyle.maxHeight>40?40:this.controlStyle.maxHeight)+"px","borderBottom":(this.controlStyle.maxHeight<=40?0:1)+"px",
                        "paddingBottom":(this.controlStyle.maxHeight<40?0:12)+"px","paddingTop":(this.controlStyle.maxHeight<30?0:12)+"px"}} onClick={this.onToggle}>
                            <h3 className={"panel-title "+(this.controlStyle.maxHeight<19?"hidden":"")}>{this.props.intl.formatMessage({id:'app.device.control'})}
                            	<span className={"glyphicon "+(IsOpenPoleControl?"glyphicon-triangle-bottom ":"glyphicon-triangle-right ")+(this.controlStyle.maxHeight<27?"hidden":"")} role="triangle-toggle"></span>
                            </h3>
                        </div>
                        <div className={"panel-body "+(!IsOpenPoleControl || this.controlStyle.maxHeight<=40?"hidden":"")}
                             style={{"maxHeight":(this.controlStyle.maxHeight>40?this.controlStyle.maxHeight-40:0)+"px",
                             "paddingBottom":(this.controlStyle.maxHeight<70?0:0)+"px","paddingTop":(this.controlStyle.maxHeight<55?0:0)+"px"}}>
                            { this.renderControl(curId) }
                        </div>
                    </div>
                </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
    }
}

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        addNotify: addNotify,
        removeAllNotify: removeAllNotify
    }, dispatch),
})

export default connect(
    mapStateToProps, mapDispatchToProps
)(injectIntl(ModelSearch));