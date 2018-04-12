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
import {getDomainLevelByMapLevel, getZoomByMapLevel, IsMapCircleMarker, getDeviceTypeByModel} from '../../util/index'
import {getDomainListByName} from '../../api/domain'
import {getIndexByKey} from '../../util/algorithm'
import { DOMAIN_LEVEL } from '../../common/util/index'
import {getAssetsBaseByDomain,getSearchAssets,getAssetsBaseById,getAssetsByDomainLevelWithCenter} from '../../api/asset'
import ModelSearch from '../component/ModelSearch'
import lodash from 'lodash'
import Immutable from 'immutable'
import {DOMAIN_NAME_LENGTH} from '../../common/util/constant';

export class lightMap extends Component{
    constructor(props){
        super(props);
        this.state = {
            searchOffset:0,
            modifyNow: 0,
            domainList: [],
            domainSearch:{placeholder:'输入域名称搜索', value:'', curIndex:-1},
            panLatlng: null,
            placeholderList: [],
            curPositionList:[],
            curList: [],
            mapId: "lightMap",

            /* 新增－20170915 */
            model:"pole",
            interactive:false,
            tableIndex: 0,
            tmapLatlng:{lng: 121.49971691534425, lat: 31.239658843127756},
            deviceId:"",
            IsSearch: true,
            IsSearchResult: false,
            
            curId:"lamp",
            search:Immutable.fromJS({id:"search", value:''}),
            
            screen:Immutable.fromJS({width:192, height:576, online:1, brightness:100, "brightness_mode":"环境亮度", "switch_power":1, timeTable:"time1", faultList:["sys_fault"]}),
            camera:Immutable.fromJS({"online_people":"50", focus:60, "preset":1, faultList:["vram_fault"]}),
            lamp:Immutable.fromJS({online:1, "switch_power":1, brightness:100, strategy:"strategy1", IsGroup:false, faultList:[]}),
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
            deviceList:[],
            domainList:{
                titleField: 'name',
                valueField: 'name',
                index: 0,
                value: "",
                options: [
                    {id: 1, title: 'domain01', value: 'domain01'},
                    {id: 2, title: 'domain02', value: 'domain02'},
                    {id: 3, title: 'domain03', value: 'domain03'},
                    {id: 4, title: 'domain04', value: 'domain04'},
                    {id: 5, title: 'domain05', value: 'domain05'},
                    {id: 6, title: 'domain06', value: 'domain06'},
                    {id: 7, title: 'domain07', value: 'domain07'}
                ]
            },
            isMouseEnter:false
        }

        this.map = {
            center:{ lng: 121.49971691534425, lat: 31.239658843127756 }
        };
        this.panLatlng = null;
        this.listStyle = {"maxHeight":"200px"};
        this.infoStyle = {"maxHeight":"352"};
        this.controlStyle= {"maxHeight":"180"};
        this.domainLevel = DOMAIN_LEVEL+1;
        this.domainCurLevel = 0;

        this.andNot= 0;

        this.screen = Immutable.fromJS({})
        this.faultKeys = ["sys_fault", "vram_fault", "disp_module_fault", "disp_module_power_fault", "single_pixel_tube_fault",
            "detection_sys_fault", "ac_fault", "lightning_arrester_fault", "photosensor_fault", "abnormal_temperature_fault",
            "door_switch_fault"];

        this.deviceTypes = [
            {id:"pole", className:"icon_pole"},
            {id:"screen", className:"icon_screen"},
            {id:"camera", className:"icon_camera"},
            {id:"lamp", className:"icon_lc"},
            {id:"charge", className:"icon_charge_pole"}
        ];

        this.deviceList = []

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
        this.searchDeviceSelect = this.searchDeviceSelect.bind(this);
        this.infoDeviceSelect = this.infoDeviceSelect.bind(this);
        this.closeClick = this.closeClick.bind(this);

        /*  新增－t  */
        //this.initDomainList = this.initDomainList.bind(this);
        this.searchInputOnKeyUp=this.searchInputOnKeyUp.bind(this);

        /*  新增－t－20170915  */
        this.searchPromptList = [{id:"device", value:"设备"},{id:"domain", value:"域"}];
        this.requestSearch = this.requestSearch.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.updateSearch = this.updateSearch.bind(this);
        
        //this.requestPoleAsset = this.requestPoleAsset.bind(this);
        //this.updatePoleAsset = this.updatePoleAsset.bind(this);
        this.domainList = [];
        this.stopProp = this.stopProp.bind(this);
        this.isMouseEnterSet = this.isMouseEnterSet.bind(this);
        this.requestCurDomain = this.requestCurDomain.bind(this);
        this.requestCurAssets = this.requestCurAssets.bind(this);
        this.mapDragend = this.mapDragend.bind(this);
        this.mapZoomend = this.mapZoomend.bind(this);
        this.markerClick = this.markerClick.bind(this);
        this.modifyNow = this.modifyNow.bind(this);
        this.searchCancel = this.searchCancel.bind(this);
        this.handleInfo = this.handleInfo.bind(this)

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

        /*  新增－t  */
        // getDomainList(data=>{
        //     if(this.mounted){
        //         this.domainList = data;
        //     }
        //     this.mounted && this.initDomainList(data)
        // })
        
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

    // updatePlaceholder(){
    //     const {domainList, domainSearch} = this.state;
    //     let datalist = [];
    //     for(var key in domainList){
    //         let item = domainList[key];
    //         if(!domainSearch.value || item.name.indexOf(domainSearch.value)>-1){
    //             datalist.push({id:item.id, value:item.name})
    //         }
    //     }
    //     this.setState({placeholderList:datalist});
    // }

    /*  新增－t  */
    searchInputOnKeyUp(e){
        if(e.keyCode===13||e==="toSearch"){}else{return}
    }

    /*  新增－t－20170915  */
    requestSearch(offset){
        const {model, search, tableIndex} = this.state;
        let searchType = this.searchPromptList[tableIndex].id;
        let searchValue = search.get("value");
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
        this.setState({searchList:searchList,tableIndex:tableIndex,IsSearchResult:true},()=>{console.log(this.state.searchList)});
    }

    // requestPoleAsset(data){
    //     const {model} = this.state;
    //     if(model != "pole"){return;};
    //     let assets = [];
    //     let ids = [];
    //     let datas = [];
    //     for(let i=0;i<data.length;i++){
    //         getPoleAssetById(data[i].id, (id,res)=>{ assets.push(res[0]); ids.push({id:id}); datas.push({id:id,data:res}); if(data.length==assets.length){this.updatePoleAsset(ids,assets,datas)} });
    //     }
    //     //this.mounted && this.updatePoleAsset(id,data)
    // }

    // updatePoleAsset(id, data, datas){
    //     console.log("ids:",id);
    //     console.log("poleAsset:",data);
    //     console.log("data:",datas);
    //     const { searchList } = this.state;
    //     let deviceList = this.state.deviceList_d;
    //     let positionList = this.state.positionList_d;
    //     let indexList = [];
    //     for(let i=0;i<id.length;i++){
    //         let curIndex = getIndexByKey(searchList, 'id', id[i].id);
    //         let asset = searchList.getIn([curIndex,"asset"]);
    //         let dataV = datas[i];
    //         let pv = {curIndex:curIndex,asset:asset,dataV:dataV};
    //         indexList.push(pv);
    //     }
    //     for(let i=0;i<indexList.length;i++){
    //         if(!indexList[i].asset){
    //             indexList[i].asset = {}
    //         }
    //     }
    //     if(!data[0]){
    //         positionList = positionList.filter(item => {if (item.device_id != id) {return item }})
    //         deviceList = deviceList.filter(item => {if (item.id == id) {return item }})
    //         return;
    //     }
    //     for(let i=0;i<data.length;i++){
    //         indexList[i].asset = Object.assign({}, indexList[i].asset, {lamp:data[i]});
    //         if(data[i].extendType == "screen"||data[i].extendType == "xes"||data[i].extendType == "camera"||data[i].extendType == "charge"){
    //             positionList = positionList.filter(item => {if (item.device_id != id) {return item }})
    //             deviceList = deviceList.filter(item => {if (item.id == id) {return item }})
    //             return;
    //         }else if(data[i].extendType == "lc"){
    //             for(let j=0;j<deviceList.length;j++){
    //                 for(let k=0;k<indexList.length;k++){
    //                     if(deviceList[j].id==indexList[k].dataV.id){
    //                         deviceList[j]["lamp"] = data[j].id;
    //                     }
    //                 }
    //             }
    //         }else{}

    //         this.setState({searchList:this.state.searchList.updateIn([indexList[i].curIndex,"asset"], v=>Immutable.fromJS(indexList[i].asset))})
    //     }
    //     /* 列出搜索项 */
    //     this.setState({IsSearchResult:true, deviceList:deviceList, positionList:positionList},()=>{});
    // }

    // initDomainList(data) {
    //     let domainList = Object.assign({}, this.state.domainList, {index: 0}, {value: data.length ? data[0].name : ""}, {options: data});
    //     this.setState({domainList:domainList},()=>{});
    // }

    isMouseEnterSet(){
        this.setState({isMouseEnter:!this.state.isMouseEnter},()=>{});
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

    onBlur(event){
        this.timeOut = setTimeout(()=>{this.setState({interactive:false,IsSearchResult:false});}, 1000)
    }

    stopProp(event){
        event.nativeEvent.stopPropagation();
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
            case "screenSwitch":
                this.screenSwitch.value = this.screenSwitch.options[event.target.selectedIndex].value;
                this.setState(this.screenSwitch);
                break;
            case "timeTable":
                this.setState({timeTableList: this.state.timeTableList.update("value", v=>this.state.timeTableList.getIn(["options", event.target.selectedIndex, "name"]))})
                break;
            case "lightSwitch":
                this.lightSwitch.value = this.lightSwitch.options[event.target.selectedIndex].value;
                this.setState(this.lightSwitch);
                break;
            case "strategy":
                this.setState({strategyList:this.state.strategyList.update("value", v=>this.state.strategyList.getIn(["options", event.target.selectedIndex, "name"]))})
                break;
            case "handler":
                this.lightList.value = this.lightList.options[event.target.selectedIndex].value;
                this.setState(this.lightList);
                break;
            case "focus":
                this.setState({camera:this.state.camera.update("focus", v=>event.target.value)});
                break;
            case "preset":
                this.presetList.value = this.presetList.options[event.target.selectedIndex].value;
                this.setState(this.presetList);
                break;
        }
    }

    faultClick(event){
        this.setState({IsOpenFault: true, faultStyle:{"top":(event.pageY+20)+"px"}});
    }

    handleInfo(curList,positionList,item,tableIndex,IsSearchResult){
        this.setState({ curList:curList,positionList:positionList,searchList:Immutable.fromJS([item]) },()=>{
            if(tableIndex===0&&IsSearchResult){
                    //如果是根据设备名称搜索
                    if(this.domainCurLevel===5){
                        //如果域级别是设备级别，则移动到指定坐标
                        this.map = Object.assign({}, this.map, {center:{lng:curList[0].geoPoint.lng, lat:curList[0].geoPoint.lat}});
                    }else{
                        //如果域级别不是是设备级别，则地图跳转到设备级别并移动到指定坐标
                        this.map = Object.assign({}, this.map, {zoom:16,center:{lng:curList[0].geoPoint.lng, lat:curList[0].geoPoint.lat}});
                    }
            }else if(tableIndex===1&&IsSearchResult){
                    //如果是根据域名称搜索
                    if(curList[0].level===this.domainCurLevel){
                        //如果域级别与搜索域级别相同，则移动到指定坐标
                        this.map = Object.assign({}, this.map, {center:{lng:curList[0].geoPoint.lng, lat:curList[0].geoPoint.lat}});
                    }else{
                        //如果域级别与搜索域级别不相同，则计算出地图级别并跳转到此级别并移动到指定坐标
                        let zoom = getZoomByMapLevel(curList[0].level,this.domainLevel,this.map);
                        this.map = Object.assign({}, this.map, {zoom:zoom,center:{lng:curList[0].geoPoint.lng, lat:curList[0].geoPoint.lat}});
                        this.domainCurLevel = getDomainLevelByMapLevel(this.domainLevel, this.map);
                        this.requestCurDomain();
                    }
            }else{
                    //如果是点击地图图标
                    if(this.domainCurLevel===5){
                        //如果地图级别是设备级别，则移动到指定坐标并显示状态信息
                        this.map = Object.assign({}, this.map, {center:{lng:curList[0].geoPoint.lng, lat:curList[0].geoPoint.lat}});
                    }else if(this.domainCurLevel<5){
                        //如果地图级别是域级别，则向下一个地图级别并显示信息
                        let zoom = this.map.zoom+3;
                        this.map = Object.assign({}, this.map, {zoom:zoom,center:{lng:curList[0].geoPoint.lng, lat:curList[0].geoPoint.lat}});
                    }else{}
            }
        });
    }

    submit(key){
    }

    itemClick(item){
        let curList = [];
        let positionList = [];
        let data  = item.toJS();
        let geoPoint = data.geoPoint ? data.geoPoint : {lat:"", lng:""};
        let position = Object.assign(geoPoint, {"device_type":"DEVICE", "device_id":data.id, IsCircleMarker:IsMapCircleMarker(this.domainLevel, this.map)});
        curList.push(data);
        positionList.push(position);
        this.setState({searchList:Immutable.fromJS([item]),curList:curList, positionList:positionList},()=>{
            if(this.state.tableIndex===0&&this.state.IsSearchResult){
                    if(this.domainCurLevel===5){
                        this.map = Object.assign({}, this.map, {center:{lng:data.geoPoint.lng, lat:data.geoPoint.lat}});
                    }else{
                        this.map = Object.assign({}, this.map, {zoom:16,center:{lng:data.geoPoint.lng, lat:data.geoPoint.lat}});
                    }
                    this.setState({IsSearch:false, IsOpenFault:true, interactive:false, IsSearchResult:false, IsOpenPoleInfo:true, IsOpenPoleControl:false},()=>{});
            }else if(this.state.tableIndex===1&&this.state.IsSearchResult){
                    if(data.level===this.domainCurLevel){
                        this.map = Object.assign({}, this.map, {center:{lng:data.geoPoint.lng, lat:data.geoPoint.lat}});
                    }else{
                        let zoom = getZoomByMapLevel(data.level,this.domainLevel,this.map);
                        this.map = Object.assign({}, this.map, {zoom:zoom,center:{lng:data.geoPoint.lng, lat:data.geoPoint.lat}});
                        this.domainCurLevel = getDomainLevelByMapLevel(this.domainLevel, this.map);
                    }
                    this.setState({IsSearch:true, IsOpenFault:true, interactive:false, IsSearchResult:false, IsOpenPoleInfo:false, IsOpenPoleControl:false},()=>{});
            }else{
                    if(this.domainCurLevel===5){
                        this.map = Object.assign({}, this.map, {center:{lng:data.geoPoint.lng, lat:data.geoPoint.lat}});
                        this.setState({IsSearch:false, IsOpenFault:true, interactive:false, IsSearchResult:false, IsOpenPoleInfo:true, IsOpenPoleControl:false},()=>{});
                    }else if(this.domainCurLevel<5){
                        let zoom = this.map.zoom+3;
                        this.map = Object.assign({}, this.map, {zoom:zoom,center:{lng:data.geoPoint.lng, lat:data.geoPoint.lat}});
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

    searchDeviceSelect(id){
        return;
    }

    infoDeviceSelect(id){
        this.setState({curId:id, IsOpenFault:false}, ()=>{
            this.setSize();
        });
    }

    searchSubmit(index){
        // console.log(index)
        // const {domainList, domainSearch} = this.state;
        // console.log(domainList.length)
        // console.log(domainList.options.length)
        // if(index===1){
            
        //     for(let i=0;i<domainList.options.length;i++){
        //         let item = domainList.options[i];
        //         console.log(item)
        //         console.log(domainSearch)
        //         if(domainSearch.value && item.name.indexOf(domainSearch.value)>-1){
        //             this.map.center = item.geoPoint;
        //             this.panLatlng = item.geoPoint;
        //             break;
        //         }
        //     }
        // }
        //this.map = Object.assign({}, this.map, {zoom:data.zoom, center:{lng:data.latlng.lng, lat:data.latlng.lat}, distance:data.distance});
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

    requestCurAssets(){
        getAssetsByDomainLevelWithCenter(this.domainLevel, this.map, "ssslc", (data)=>{
            let positionList = data.map(item=>{
                let geoPoint = item.geoPoint ? item.geoPoint : {lat:"", lng:""};
                return Object.assign(geoPoint, {"device_type":getDeviceTypeByModel(item.extendType), "device_id":item.id});
            })
            this.mounted && this.setState({curList:data, positionList:positionList})
        })
    }

    requestCurDomain(){
    	
//  	if(this.domainCurLevel==this.domainLevel){
//          getAssetsByDomainLevelWithCenter(this.domainCurLevel, this.map, "ssslc", (data)=>{
//              let positionList = data.map(item=>{
//                  let geoPoint = item.geoPoint ? item.geoPoint : {lat:"", lng:""};
//                  return Object.assign(geoPoint, {"device_type":getDeviceTypeByModel(item.extendType), "device_id":item.id});
//              })
//              this.mounted && this.setState({curList:data, positionList:positionList})
//          })
//          return false;
//      }
        getDomainByDomainLevelWithCenter(this.domainCurLevel, this.map, (data)=>{
        	console.log(data)
            let positionList = data.map(item=>{
                let geoPoint = item.geoPoint ? item.geoPoint : {lat:"", lng:""};
                return Object.assign(geoPoint, {"device_type":"DEVICE", "device_id":item.id, IsCircleMarker: true});
            })
            console.log(positionList)
            this.mounted && this.setState({curList: data, positionList:positionList},()=>{
                let deviceLen = [];
                const locale = this.props.intl;
                data.map(item=>{
                    const itemLen = item.name.length;
                    getAssetsBaseByDomain(item.id, asset=>{
                        deviceLen.push(item.id);
                        let curIndex = lodash.findIndex(this.state.curList, domain=>{
                            return domain.id == item.id
                        })
                        if(curIndex>-1 && curIndex<this.state.curList.length){
                            this.state.curList[curIndex].detail = item.name.slice(0, DOMAIN_NAME_LENGTH-6)+
                              (itemLen>DOMAIN_NAME_LENGTH-6 ? "...":"")+
                              ' \n'+asset.length/*+this.props.intl.formatMessage({id:'map.device.tip'})*/;
                        }
                        if (deviceLen.length == data.length){
                            this.mounted && this.setState({curList: this.state.curList});
                        }
                    })
                })

            });
        })
        
//      getDomainByDomainLevelWithCenter(this.domainCurLevel, this.map, (data)=>{
//          let positionList = data.map(item=>{
//              let geoPoint = item.geoPoint ? item.geoPoint : {lat:"", lng:""};
//              return Object.assign(geoPoint, { "device_type":"DEVICE", "device_id":item.id, IsCircleMarker: true});
//          })
//          this.setState({curList: data, positionList:positionList},()=>{
//              let deviceLen = [];
//              data.map(item=>{
//                  getAssetsBaseByDomain(item.id, asset=>{
//                      deviceLen.push(item.id);
//                      let curIndex = lodash.findIndex(this.state.curList, domain=>{
//                          return domain.id === item.id
//                      })
//                      if(curIndex>-1 && curIndex<this.state.curList.length){
//                          this.state.curList[curIndex].detail = item.name+' \n'+asset.length+'件设备';
//                      }
//                      if(deviceLen.length === data.length){
//                          // this.setState({curList: this.state.curList});
//                      }
//                  })
//              })
//          })
//      })
        
    }

    panCallFun(){
        this.panLatlng = null;
    }

    mapDragend(data){
        return;
        // this.map = Object.assign({}, this.map, {zoom:data.zoom, center:{lng:data.latlng.lng, lat:data.latlng.lat}, distance:data.distance});
        // this.domainCurLevel = getDomainLevelByMapLevel(this.domainLevel, this.map);
        // if(this.map.zoom>15&&this.map.zoom<=18){
        //     this.requestCurAssets("lc");
        // }else{
        //     this.requestCurDomain();
        // }
    }

    mapZoomend(data){

        if(this.andNot===1){}else{this.andNot=this.andNot+1;return;}
        this.map = Object.assign({}, this.map, {zoom:data.zoom, center:{lng:data.latlng.lng, lat:data.latlng.lat}, distance:data.distance});
        this.domainCurLevel = getDomainLevelByMapLevel(this.domainLevel, this.map);
        if(this.map.zoom>15&&this.map.zoom<=18){
            this.requestCurAssets();
        }else{
            this.requestCurDomain();
        }

    }

    markerClick(data){
        if(this.map.zoom>15&&this.map.zoom<=18){
            getAssetsBaseById(data.id,(data)=>{
                this.itemClick(Immutable.fromJS(data))
            })
        }else{
            let zoom = '';
            if(this.map.zoom===13){zoom = this.map.zoom+2;}else{zoom = this.map.zoom+3;};
            this.map = Object.assign({}, this.map, {zoom:zoom, center:{lng:data.latlng.lng, lat:data.latlng.lat}, distance:data.distance});
            this.isMouseEnterSet();
        }
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

    IsHaveFault(parentPro, faultKeys){
        let faultList = [];
        for(var i=0;i<faultKeys.length;i++){
            if(parentPro.get(faultKeys[i]) === 1){
                faultList.push(faultKeys[i]);
            }
        }
        return faultList;
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
	                                <div className="fault-container"><span className="name">{this.formatIntl('工作状态')}:</span><span onClick={(event)=>{faultList.length>0 && this.faultClick(event)}} role="button">{faultList.length>0?"故障":"运行正常"}</span></div>
	                            }
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
                        <div className="form-group group">
                            <label className="apply_label">整组调光:</label>
                            <div className="checkbox">
                                <label>
                                  <input type="checkbox"/>{"疏影路组"}
                                </label>
                            </div>
                        </div>
                        <div className="form-group switch">
                            <label className="apply_label">灯亮开关:</label>
                            <select className="form-control" value={this.lightSwitch.value} onChange={event=>this.onChange("lightSwitch", event)}>
                                {
                                    this.lightSwitch.options.map(sw=>{
                                        return <option key={sw.id}>{sw.value}</option>
                                    })
                                }
                            </select>
                            <button className="btn btn-primary apply_btn" onClick={event=>this.submit("lightSwitch")}>应用</button>
                        </div>
                        <div className="form-group strategy">
                            <label className="apply_label">策略调光:</label>
                            <select className="form-control" value={strategyList.get("value")} onChange={event=>this.onChange("strategy", event)}>
                                {
                                    strategyList.get("options").map(strategy=>{
                                        return <option key={strategy.get("id")}>{strategy.get("name")}</option>
                                    })
                                }
                            </select>
                            <button className="btn btn-primary apply_btn" onClick={event=>this.submit("strategy")}>应用</button>
                        </div>
                        <div className="form-group handler">
                            <label className="apply_label">手动调光:</label>
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
        const {searchOffset, panLatlng, curList, mapId, deviceId, search, interactive, IsSearch, IsSearchResult, curId, searchList, tableIndex,
            listStyle, infoStyle, controlStyle, positionList,  IsOpenPoleInfo, IsOpenPoleControl} = this.state;
        let IsControl = false;
        let searchListToJS = searchList.toJS();
        let searchListLength = searchListToJS.length;
        if(curId==="screen" || curId==="lamp" || curId==="camera"){
            IsControl = true;
        }
        return (
            <Content>
                <MapView option={{zoom:this.map.zoom}} mapData={{id:mapId, latlng:this.map.center, position:positionList, data:curList}} mapCallFun={{mapDragendHandler:this.mapDragend, mapZoomendHandler:this.mapZoomend, markerClickHandler:this.markerClick}} panLatlng={this.panLatlng} panCallFun={this.panCallFun}/>
                <ModelSearch handleInfo={this.handleInfo} />
                <NotifyPopup />
            </Content>
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
)(lightMap);