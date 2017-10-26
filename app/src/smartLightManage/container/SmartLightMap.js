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
import NotifyPopup from '../../common/containers/NotifyPopup';

import {addNotify, removeAllNotify} from '../../common/actions/notifyPopup';

import Immutable from 'immutable';

import {getLightLevelConfig} from '../../util/network'
import {getDomainList} from '../../api/domain'
import {getPoleListByModelWithName, getPoleAssetById} from '../../api/pole'

import {getIndexByKey} from '../../util/algorithm'
import {getObjectByKey} from '../../util/index'
import {keyboard_key_up, keyboard_key_down, keyboard_key_enter} from '../../util/keyboard'
export class SmartLightMap extends Component{
    constructor(props){
        super(props);
        this.state = {
            model:"pole",
            IsSearch: true,

            interactive:false,
            tableIndex: 0,

            IsSearchResult: false,
            curDevice:Immutable.fromJS({
              id:1, name:"疏影路灯杆1号", asset:{screen:23, charge:45, camera:56, lamp:89, collect:99}
            }),
            curId:"screen",
            search:Immutable.fromJS({id:"search", value:''}),
            mapLatlng:{lng: 121.49971691534425, lat: 31.239658843127756},
            panLatlng:null,
            positionList:[/*{"device_id": 1,"device_type": 'DEVICE', lng: 121.49971691534425, lat: 31.239658843127756}*/],
            searchList:Immutable.fromJS([
                {id:1, name:"疏影路灯杆1号", asset:{screen:23, charge:45, camera:56, lamp:89, collect:99}},
                {id:2, name:"疏影路灯杆2号", asset:{screen:23, camera:56, lamp:89, collect:99}},
                {id:3, name:"疏影路灯杆3号", asset:{screen:23,  lamp:89, collect:99}},
                {id:4, name:"疏影路灯杆4号", asset:{lamp:89, collect:99}}
            ]),

            screen:Immutable.fromJS({width:192, height:576, online:1, brightness:100, "brightness_mode":"环境亮度", "switch_power":1, timeTable:"time1", faultList:["sys_fault"]}),
            camera:Immutable.fromJS({"online_people":"50", focus:60, "preset":1, faultList:["vram_fault"]}),
            lamp:Immutable.fromJS({online:1, "switch_power":1, brightness:100, strategy:"strategy1", IsGroup:false, faultList:["vram_fault"]}),
            charge:Immutable.fromJS({"charge_state":1, faultList:["vram_fault"]}),
            collect:Immutable.fromJS({"air-pressure":1000, "temperature":30, "humidity":50, "wind-speed":10, "wind-direction":"东南",
            "pm25":80, "o2":19, "co":5}),

            timeTableList:Immutable.fromJS({id:"timeTable", value:"time1", options:[{id:1, name:"time1"}, {id:2, name:"time2"}]}),
            strategyList:Immutable.fromJS({id:"strategy", value:"strategy1", options:[{id:1, name:"strategy1"}, {id:2, name:"strategy2"}]}),
            faultStyle: {"top": "280px"},
            IsOpenFault: false,

            listStyle:{"maxHeight":"200px"},
            infoStyle:{"maxHeight":"352"},
            controlStyle:{"maxHeight":"180"},
            IsOpenPoleInfo:true,
            IsOpenPoleControl:true
        }

        this.screen = Immutable.fromJS({})
        this.faultKeys = ["sys_fault", "vram_fault", "disp_module_fault", "disp_module_power_fault", "single_pixel_tube_fault",
            "detection_sys_fault", "ac_fault", "lightning_arrester_fault", "photosensor_fault", "abnormal_temperature_fault",
            "door_switch_fault"];

        this.deviceTypes = [
            {id:"pole", className:"icon_pole"},
            {id:"screen", className:"icon_screen"},
            {id:"camera", className:"icon_camera"},
            {id:"lc", className:"icon_lc"},
            {id:"charge", className:"icon_charge_pole"}
        ];

        this.lightList = {id:"lightValue",value:"10",options:[
            /*{id:"1", value:0}, {id:"2", value:10}, {id:"3", value:20}, {id:"4", value:30}, {id:"5", value:40},
            {id:"6", value:50}, {id:"7", value:60}, {id:"9", value:70}, {id:"10", value:80}, {id:"11", value:90}, {id:"12", value:100}*/
        ]}

        this.searchPromptList = [{id:"device", value:"设备"},{id:"domain", value:"域"}];
        this.screenSwitch = {id:"screenSwitch", value:"关",options:[{id:1, value:"关"},{id:2, value:"开"}]};
        this.lightSwitch = {id:"lightSwitch", value:"关",options:[{id:1, value:"关"},{id:2, value:"开"}]};
        this.presetList = {id:"preset", value:"1",options:[{id:1, value:"1"},{id:2, value:"2"}]};

        this.focusInput = {min:0, max:100, step:10};

        this.domainList = [];

        this.renderInfo = this.renderInfo.bind(this);
        this.renderState = this.renderState.bind(this);
        this.renderControl = this.renderControl.bind(this);

        this.setSize = this.setSize.bind(this);
        this.onChange = this.onChange.bind(this);
        this.focusClick = this.focusClick.bind(this);
        this.submit = this.submit.bind(this);
        this.backHandler = this.backHandler.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.itemClick = this.itemClick.bind(this);
        this.poleInfoCloseClick = this.poleInfoCloseClick.bind(this);
        this.onToggle = this.onToggle.bind(this);
        this.searchDeviceSelect = this.searchDeviceSelect.bind(this);
        this.infoDeviceSelect = this.infoDeviceSelect.bind(this);
        this.closeClick = this.closeClick.bind(this);

        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onkeydown = this.onkeydown.bind(this);

        this.updateCameraVideo = this.updateCameraVideo.bind(this);
        this.requestSearch = this.requestSearch.bind(this);
        this.requestPoleAsset = this.requestPoleAsset.bind(this);
        this.updateSearch = this.updateSearch.bind(this);
        this.updatePoleAsset = this.updatePoleAsset.bind(this);
    }

    componentWillMount(){
        this.mounted = true;
        getLightLevelConfig(data=>{
            if(this.mounted){
                this.lightList.options = data.map((key, index)=>{
                    return {id:index, value:key}
                });
                this.setState(this.lightList)}
        })

        getDomainList(data=>{
            if(this.mounted){
                this.domainList = data;
            }
        })
        window.onresize = event=>{
            this.mounted && this.setSize();
        }

        this.requestSearch(false);
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

    setSize(){
        if(!this.mounted){
            return;
        }
        
        const {IsSearch, curId} = this.state;
        let height = window.innerHeight;

        if(IsSearch){
            let listStyle = {"maxHeight":(height<145?0:height-145)+"px"};
            this.setState({listStyle:listStyle});
        }else{
            let defaultHeight = 230;
            if(this.refs.poleInfo){
                defaultHeight += findDOMNode(this.refs.poleInfo).offsetHeight;
            }

            let infoStyle = {"maxHeight":(height<230?0:height-230)};
            let controlStyle = {"maxHeight":(height<defaultHeight?0:height-defaultHeight)};
            this.setState({infoStyle:infoStyle, controlStyle:controlStyle});
        }
    }

    requestSearch(IsSearch=true){
        const {model, search, tableIndex} = this.state;
console.log(tableIndex);
        let searchType = this.searchPromptList[tableIndex].id;
        console.log(this.domainList);
        if(searchType=="domain"){
            let curDomain = getObjectByKey(this.domainList, 'name', search.get("value"));
            if(curDomain){
                getPoleListByModelWithName(searchType, model, curDomain.id, (data)=>{this.mounted && this.updateSearch(data, IsSearch)});
            }else{
                this.props.actions.addNotify(0, "没有找到匹配域。");
                this.setState({IsSearchResult:false});
            }
            return;
        }
console.log("%%%%%%%")
        getPoleListByModelWithName(searchType, model, search.get("value"), (data)=>{this.mounted && this.updateSearch(data, IsSearch)});
    }

    updateSearch(data, IsSearch){
        console.log(data);
        if(IsSearch && (!data || data.length==0)){
            this.props.actions.addNotify(0, "没有找到结果。");
        }

        let searchList = Immutable.fromJS(data);
        let positionList = data.map((pole)=>{
            let latlng = pole.geoPoint;
            return Object.assign({}, {"device_id": pole.id,"device_type": 'DEVICE'}, latlng)
        });

        if(data && data.length){
            let fPole = data[0];
            let flatlng = fPole.geoPoint;
            this.setState({searchList:searchList, mapLatlng:flatlng,positonList:positionList}, ()=>{
                this.requestPoleAsset(data);
            });
        }else{
            this.setState({searchList:searchList, positionList:positionList}, ()=>{
                this.requestPoleAsset(data);
            });
        }
    }

    requestPoleAsset(data){
        const {model} = this.state;
        if(model != "pole"){
            return;
        }

        data.map(pole=>{
            getPoleAssetById(pole.id, (id,data)=>{this.mounted && this.updatePoleAsset(id, data)});
        })
    }

    updatePoleAsset(id, data){
        console.log("poleAsset:",data);
        const {searchList} = this.state;
        let curIndex = getIndexByKey(searchList, 'id', id);
        let asset = this.state.searchList.getIn([curIndex, "asset"]);
        if(!asset){
            asset = {}
        }

        data.map(ass=>{
            if(ass.extendType == "lc"){//screen:23, charge:45, camera:56, lamp:89, collect:99
                asset = Object.assign({}, asset, {lamp:ass});
            }
            if(ass.extendType == "screen"){
                asset = Object.assign({}, asset, {screen:ass});
            }
            if(ass.extendType == "xes"){
                asset = Object.assign({}, asset, {collect:ass});
            }
            if(ass.extendType == "camera"){
                asset = Object.assign({}, asset, {camera:ass});
            }
            if(ass.extendType == "charge"){
                asset = Object.assign({}, asset, {charge:ass});
            }
        })

        this.setState({searchList:this.state.searchList.updateIn([curIndex, "asset"], v=>Immutable.fromJS(asset))});
    }

    updateCameraVideo(data){
        if(this.refs.camera != null && data.hasOwnProperty('camera_url')){

            this.client = new JSMpeg.Player(data.camera_url, { canvas: this.refs.camera })
            /* this.client = new WebSocket(data.camera_url);
             this.client.onerror = function (err) {
             console.log(err);
             }
             var player = new jsmpeg(this.client, {canvas: this.refs.camera});
             */
        }
    }

    formatIntl(formatId){
        // return this.props.intl.formatMessage({id:formatId});
        return formatId;
    }

    onChange(key, event){
        switch (key){
            case "search"://特殊处理
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

    focusClick(id){
        const {camera} = this.state;
        let curVal = camera.get("focus");
        const {min, max, step} = this.focusInput;
        if(id == "minus" && curVal>min){
            curVal -= step;
        }else if(id=="plus" && curVal<max){
            curVal += step;
        }

        this.setState({camera:this.state.camera.update("focus", v=>curVal)});
    }

    faultClick(event){
        this.setState({IsOpenFault: true, faultStyle:{"top":(event.pageY+20)+"px"}});
    }

    submit(key){
        console.log(key);
    }

    itemClick(asset){
        const {model} = this.state
        if(model == "pole"){
            let curId = "";
            if(asset.getIn(["asset","screen"])){
                curId = "screen";
            } else if(asset.getIn(["asset","lamp"])) {
                curId = "lamp";
            } else if(asset.getIn(["asset","camera"])){
                curId = "camera";
            } else if(asset.getIn(["asset","charge"])){
                curId = "charge";
            } else if(asset.getIn(["asset","collect"])){
                curId = "collect";
            }
            this.setState({curDevice:asset, curId:curId, panLatlng:asset.geoPoint,IsSearch:false, IsOpenFault:false, IsOpenPoleInfo:true, IsOpenPoleControl:true},()=>{
                this.setSize();
            });

        }else{
            this.setState({curDevice:asset, panLatlng:asset.geoPoint, IsSearch:false, IsOpenFault:false, IsOpenPoleInfo:true, IsOpenPoleControl:true},()=>{
                this.setSize();
            });
        }
    }

    backHandler(){
        this.setState({IsSearch:true}, ()=>{
            this.setSize();
        });
    }

    searchDeviceSelect(id){
        this.setState({model:id, IsSearch:true, IsSearchResult:false, IsOpenFault:false});
    }

    infoDeviceSelect(id){
        this.setState({curId:id, IsOpenFault:false}, ()=>{
            this.setSize();
        });
    }

    searchSubmit(index){
        this.setState({IsSearch:true, IsSearchResult:true, tableIndex:index,
            searchList:this.state.searchList.splice(0)},()=>{
            this.setSize();
            this.requestSearch();
        });
    }

    onFocus(event){
        // this.setState({interactive:true});
        this.setState({IsSearch:true});
    }

    onBlur(event){
        this.timeOut = setTimeout(()=>{this.mounted && this.setState({interactive:false});}, 1000)
    }

    onkeydown(event){
        let tableIndex = this.state.tableIndex;
        let datalist = this.searchPromptList;
        switch(event.key){
            case keyboard_key_up:
                if(tableIndex>0){
                    tableIndex--;
                }
                break;
            case keyboard_key_down:
                if(tableIndex<datalist.length-1){
                    tableIndex++;
                }
                break;
            case keyboard_key_enter:
                if(tableIndex>-1&&tableIndex<datalist.length){
                    this.setState({interactive:false}, ()=>this.searchSubmit(tableIndex));
                }
                break;
        }
console.log("tableIndex:",tableIndex)
        this.setState({tableIndex:tableIndex});
    }

    poleInfoCloseClick(){
        this.setState({IsOpenPoleInfo: false}, ()=>{
            this.setSize();
        })
    }

    onToggle(){
        this.setState({IsOpenPoleControl:!this.state.IsOpenPoleControl});
    }

    closeClick(){
        this.setState({IsOpenFault:false});
    }
    transformState(key, sf){
        if(key == 'wind-direction'){
            // return this.formatIntl('app.'+sf);
            return <span className="glyphicon glyphicon-arrow-up" style={{transform:`rotate(${sf}deg)`}}></span>
        }

        if(key == 'brightness_mode'){
            return this.formatIntl(sf ? 'manual' : 'environment-brightness-control');
        }

        if(key == 'online'){
            return this.formatIntl(sf ? '在线' : '离线');
        }

        if(key == 'charge_state'){
            return this.formatIntl(sf ? '充电中' : '充电故障');
        }
        return this.formatIntl(sf ? 'abnormal':'normal');
    }

    IsHaveFault(parentPro, faultKeys){
        let faultList = [];
        for(var i=0;i<faultKeys.length;i++){
            if(parentPro.get(faultKeys[i]) == 1){
                faultList.push(faultKeys[i]);
            }
        }

        return faultList;
    }

    renderState(parentPro, key, name, IsTransform, unit){
        if(key == "resolution"){
            if(parentPro && parentPro.has("width") && parentPro.has("height")){
                return <div key={key} className="pro"><span>{name?this.formatIntl(name):key}:</span>{parentPro.get("width")}x{parentPro.get("height")}</div>
            }
        }
        if(parentPro && parentPro.has(key)){
            if(key == 'wind-direction'){
                return <div key={key} className="pro"><span>{name ? this.formatIntl(name):key}:</span>{this.transformState(key, parentPro.get(key))}</div>
            }

            if(key == 'o2'){
                return <div key={key} className="pro"><span>{name ? this.formatIntl(name):key}:</span>{(parentPro.get(key))+(unit ? ' %'+unit:'')}</div>
            }
            return <div key={key} className="pro"><span>{name ? this.formatIntl(name):key}:</span>{(IsTransform ? this.transformState(key, parentPro.get(key)): parentPro.get(key))+(unit ? ' '+unit:'')}</div>
        }
    }

    renderInfo(id, props){
        let faultList = [];
        const {faultStyle, IsOpenFault} = this.state;
        switch(id){
            case "screen":
                const {screen} = this.state;
                faultList = screen.get("faultList").toJS();

                return <div className="row state-info screen">
                    <div className="col-sm-8 prop">
                        {this.renderState(props, "resolution", "width")}
                        {this.renderState(props, "online", "online", true)}
                        {this.renderState(props, "version", "version")}
                        {this.renderState(props, "brightness_mode", "brightness_mode", true)}
                        {this.renderState(props, "brightness", "brightness")}
                        {
                            <div className="fault-container"><span className="name">{this.formatIntl('fault')}:</span><span className={faultList.length>0?"fault":"pass"} onClick={(event)=>{faultList.length>0 && this.faultClick(event)}}></span></div>
                        }
                        {
                            faultList.length>0 &&
                            <Panel className={"faultPanel panel-primary "+(IsOpenFault?'':'hidden')} style={faultStyle} title={this.formatIntl('fault_info')} closeBtn={true}
                                   closeClick={this.closeClick}>
                                {
                                    faultList.map(key=>{
                                        return <div key={key}>{this.formatIntl(""+key)}</div>
                                    })
                                }
                            </Panel>
                        }
                    </div>
                    <div className="col-sm-4 img-container"><img src="http://localhost:8080/images/smartLight/screen_test.png"/></div>
                </div>
            case "camera":
                const {camera} = this.state;
                faultList = camera.get("faultList").toJS();
                return <div className="row state-info camera">
                    <div className="col-sm-12 prop">
                        {this.renderState(props, "online_people", "online_people")}
                        {
                            <div className="fault-container"><span className="name">{this.formatIntl('fault')}:</span><span className={faultList.length>0?"fault":"pass"} onClick={(event)=>{faultList.length>0 && this.faultClick(event)}}></span></div>
                        }
                        {
                            faultList.length>0 &&
                            <Panel className={"faultPanel panel-primary "+(IsOpenFault?'':'hidden')} style={faultStyle} title={this.formatIntl('fault_info')} closeBtn={true}
                                   closeClick={this.closeClick}>
                                {
                                    faultList.map(key=>{
                                        return <div key={key}>{this.formatIntl(""+key)}</div>
                                    })
                                }
                            </Panel>
                        }
                    </div>
                </div>
            case "lamp":
                const {lamp} = this.state;
                faultList = lamp.get("faultList").toJS();
                return <div className="row state-info lamp">
                        <div className="col-sm-12 prop">
                            {this.renderState(props, "online", "online", true)}
                            {this.renderState(props, "brightness", "brightness")}
                            {
                                <div className="fault-container"><span className="name">{this.formatIntl('fault')}:</span><span className={faultList.length>0?"fault":"pass"} onClick={(event)=>{faultList.length>0 && this.faultClick(event)}}></span></div>
                            }
                            {
                                faultList.length>0 &&
                                <Panel className={"faultPanel panel-primary "+(IsOpenFault?'':'hidden')} style={faultStyle} title={this.formatIntl('fault_info')} closeBtn={true}
                                       closeClick={this.closeClick}>
                                    {
                                        faultList.map(key=>{
                                            return <div key={key}>{this.formatIntl(""+key)}</div>
                                        })
                                    }
                                </Panel>
                            }
                        </div>
                    </div>
            case "charge":
                const {charge} = this.state;
                faultList = charge.get("faultList").toJS();
                return <div className="row state-info charge">
                            <div className="col-sm-12 prop">
                                {this.renderState(props, "charge_state", "charge_state", true)}
                                {
                                    <div className="fault-container"><span className="name">{this.formatIntl('fault')}:</span><span className={faultList.length>0?"fault":"pass"} onClick={(event)=>{faultList.length>0 && this.faultClick(event)}}></span></div>
                                }
                                {
                                    faultList.length>0 &&
                                    <Panel className={"faultPanel panel-primary "+(IsOpenFault?'':'hidden')} style={faultStyle} title={this.formatIntl('fault_info')} closeBtn={true}
                                           closeClick={this.closeClick}>
                                        {
                                            faultList.map(key=>{
                                                return <div key={key}>{this.formatIntl(""+key)}</div>
                                            })
                                        }
                                    </Panel>
                                }
                            </div>
                    </div>
            case "collect":
                return <div className="row state-info collect">
                        <div className="col-sm-12 prop">
                            {this.renderState(props, "temperature", "temperature", false, '℃')}
                            {this.renderState(props, "humidity", "humidity", false, 'rh%')}
                            {this.renderState(props, "air-pressure", "air-pressure", false, 'hPa')}
                            {this.renderState(props, "noise", "noise", false, 'dB')}
                            {this.renderState(props, "wind-speed", "wind-speed", false, 'm/s')}
                            {this.renderState(props, "wind-direction", "wind-direction", true)}
                            {this.renderState(props, "pm25", "pm25", false, 'ug/m^3')}
                            {this.renderState(props, "o2", "o2", false, 'VOL')}
                            {this.renderState(props, "co", "co", false, 'ppm')}
                        </div>
                    </div>
        }
    }
    renderControl(id){
        switch(id){
            case "screen":
                const {timeTableList} = this.state
                return <div className="row state-control screen">
                        <div className="col-sm-12 form-group switch">
                            <label className="col-sm-4">显示屏开关:</label>
                            <select className="col-sm-4" value={this.screenSwitch.value} onChange={event=>this.onChange("screenSwitch", event)}>
                                {
                                    this.screenSwitch.options.map(sw=>{
                                        return <option key={sw.id}>{sw.value}</option>
                                    })
                                }
                            </select>
                            <button className="col-sm-3 btn btn-primary padding-left" onClick={event=>this.submit("screenSwitch")}>应用</button>
                        </div>
                        <div className="col-sm-12 form-group time-table">
                            <label className="col-sm-4">时间表1</label>
                            <select className="col-sm-4" value={timeTableList.get("value")} onChange={event=>this.onChange("timeTable", event)}>
                                {
                                    timeTableList.get("options").map(time=>{
                                        return <option key={time.get("id")}>{time.get("name")}</option>
                                    })
                                }
                            </select>
                            <button className="col-sm-3 btn btn-primary" onClick={event=>this.submit("timeTable")}>应用</button>
                        </div>
                    </div>
            case "camera":
                const {camera} = this.state;
                const {min, max, step} = this.focusInput;
                return <div className="row state-control camera">
                    <div className="col-sm-12 video">
                        <canvas ref="camera">
                        </canvas>
                    </div>
                    <div className="col-sm-12 form-group focus">
                        <label className="col-sm-3">变焦:</label>
                        <div className="col-sm-9">
                            <span className="glyphicon glyphicon-minus minus" onClick={()=>this.focusClick('minus')}></span>
                            <input type="range" min={min} max={max} step={step} value={camera.get("focus")} onChange={event=>this.onChange("focus", event)}/>
                            <span className="glyphicon glyphicon-plus plus" onClick={()=>this.focusClick('plus')}></span>
                        </div>
                    </div>
                    <div className="col-sm-12 form-group preset">
                        <label className="col-sm-3">预置:</label>
                        <select className="col-sm-6" value={this.presetList.value} onChange={event=>this.onChange("preset", event)}>
                            {
                                this.presetList.options.map(sw=>{
                                    return <option key={sw.id}>{sw.value}</option>
                                })
                            }
                        </select>
                        <button className="col-sm-3 btn btn-primary" onClick={event=>this.submit("preset")}>切换</button>
                    </div>
                </div>
            case "lamp":
                const {strategyList} = this.state;
                return <div className="row state-control lamp">
                        <div className="col-sm-12 form-group group">
                            <label className="col-sm-4">整组调光:</label>
                            <label className="col-sm-8 checkbox-inline">
                                <input type="checkbox"/>
                                {"疏影路组"}
                            </label>
                        </div>

                        <div className="col-sm-12 form-group strategy">
                            <label className="col-sm-4">策略调光:</label>
                            <select className="col-sm-4" value={strategyList.get("value")} onChange={event=>this.onChange("strategy", event)}>
                                {
                                    strategyList.get("options").map(strategy=>{
                                        return <option key={strategy.get("id")}>{strategy.get("name")}</option>
                                    })
                                }
                            </select>
                            <button className="col-sm-3 btn btn-primary" onClick={event=>this.submit("strategy")}>应用</button>
                        </div>
                        <div className="col-sm-12 form-group handler">
                            <label className="col-sm-4">手动调光:</label>
                            <select className="col-sm-4" value={this.lightList.value} onChange={(event)=>{this.onChange("handler", event)}}>
                                {
                                    this.lightList.options.map(light=>{
                                        return <option key={light.id}>{light.value}</option>
                                    })
                                }
                            </select>
                            <button className="col-sm-3 btn btn-primary" onClick={event=>this.submit("handler")}>应用</button>
                        </div>
                    </div>
        }
    }

    /* <div className="col-sm-12 form-group switch">
     <label className="col-sm-4">灯开关:</label>
     <select className="col-sm-4" value={this.lightSwitch.value} onChange={event=>this.onChange("lightSwitch", event)}>
     {
     this.lightSwitch.options.map(sw=>{
     return <option key={sw.id}>{sw.value}</option>
     })
     }
     </select>
     <button className="col-sm-3 btn btn-primary" onClick={event=>this.submit("lightSwitch")}>应用</button>
     </div>*/
    
    render(){
        const {model, search, IsSearch, interactive,tableIndex,IsSearchResult, curDevice, curId, mapLatlng, panLatLng, positionList,searchList,
            listStyle, infoStyle, controlStyle, IsOpenPoleInfo, IsOpenPoleControl} = this.state;

        let IsControl = false;
        if(curId=="screen" || curId=="lamp" || curId=="camera"){
            IsControl = true
        }

console.log("searchList:",searchList.toJS());
        return (
            <Content>
                <MapView mapData={{id:"smartLightMap", latlng:mapLatlng, position:positionList, data:searchList.toJS()}} panLatlng={panLatLng}/>
                <div className="search-container">
                    <div className={"searchText smartLight-map"} onFocus={this.onFocus} onBlur={this.onBlur} onKeyDown={this.onkeydown}>
                        <input type="search" className="form-control" placeholder="搜索名称或域" value={search.get("value")} onChange={(event)=>this.onChange('search', event)}/>
                        <ul className={interactive ? 'select-active':''} >
                            {
                                this.searchPromptList.map((item, index)=>{
                                    return <li className={index==tableIndex?"active":""} key={index} value={item.value} onClick={()=>this.searchSubmit(index)}><span>{item.value}</span>{search.get("value")}</li>
                                })
                            }
                        </ul>
                        <span className="glyphicon glyphicon-search hidden"></span>
                    </div>
                    <ul className={"list-group "+(IsSearch && IsSearchResult?"":"hidden")} style={listStyle}>
                        {
                            searchList.map(pole=>{
                                return <li key={pole.get("id")} className="list-group-item" onClick={()=>this.itemClick(pole)}>
                                    {pole.get("name")}

                                    {pole.getIn(["asset","collect"]) && <span className="icon icon_collect"></span>}
                                    {pole.getIn(["asset","charge"]) && <span className="icon icon_charge"></span>}
                                    {pole.getIn(["asset","camera"]) && <span className="icon icon_camera"></span>}
                                    {pole.getIn(["asset","lamp"]) && <span className="icon icon_lamp"></span>}
                                    {pole.getIn(["asset","screen"]) && <span className="icon icon_screen"></span>}
                                </li>
                            })
                        }
                    </ul>

                    <div className={"margin-top margin-bottom search-back "+(IsSearch?"hidden":"")} style={{"marginBottom":(infoStyle.maxHeight>0?15:0)+"px"}}
                        onClick={this.backHandler}>
                        <span className="glyphicon glyphicon-menu-left padding-left padding-right"></span>
                        <span className="name">{"返回搜索结果"}</span>
                    </div>
                    <div ref="poleInfo" id="poleInfo" className={"panel panel-info pole-info "+(IsSearch || !IsOpenPoleInfo || infoStyle.maxHeight==0?"hidden":"")}
                         style={{"maxHeight":infoStyle.maxHeight+"px"}}>
                        <div className={"panel-heading "+(infoStyle.maxHeight==0?"hidden":"")} style={{"maxHeight":(infoStyle.maxHeight>40?38:infoStyle.maxHeight)+"px"}}>
                            <h3 className={"panel-title "+(infoStyle.maxHeight<30?"hidden":"")}>{curDevice.get("name")}</h3>

                        </div>
                        <div className={"panel-body "+(infoStyle.maxHeight<40?"hidden":"")} style={{"maxHeight":(infoStyle.maxHeight>40?infoStyle.maxHeight-40:0)+"px"}}>
                            <ul className={"btn-group "+(model=="pole"?"":"hidden")}>
                                {curDevice.getIn(["asset","screen"]) && <li className={(infoStyle.maxHeight<88?"hidden ":" ")+(curId=="screen"?"active":"")} onClick={()=>this.infoDeviceSelect("screen")}><span className={"icon icon_screen"+(curId=="screen"?"_hover":"")}></span></li>}
                                {curDevice.getIn(["asset","lamp"]) && <li className={(infoStyle.maxHeight<88?"hidden ":" ")+(curId=="lamp"?"active":"")} onClick={()=>this.infoDeviceSelect("lamp")}><span className={"icon icon_lc"+(curId=="lamp"?"_hover":"")}></span></li>}
                                {curDevice.getIn(["asset","camera"]) && <li className={(infoStyle.maxHeight<88?"hidden ":" ")+(curId=="camera"?"active":"")} onClick={()=>this.infoDeviceSelect("camera")}><span className={"icon icon_camera"+(curId=="camera"?"_hover":"")}></span></li>}
                                {curDevice.getIn(["asset","charge"]) && <li className={(infoStyle.maxHeight<88?"hidden ":" ")+(curId=="charge"?"active":"")} onClick={()=>this.infoDeviceSelect("charge")}><span className={"icon icon_charge_pole"+(curId=="charge"?"_hover":"")}></span></li>}
                                {curDevice.getIn(["asset","collect"]) && <li className={(infoStyle.maxHeight<88?"hidden ":" ")+(curId=="collect"?"active":"")} onClick={()=>this.infoDeviceSelect("collect")}><span className={"icon icon_collect"+(curId=="collect"?"_hover":"")}></span></li>}
                            </ul>
                            {
                                this.renderInfo(curId,this.state[curId])
                            }
                        </div>
                    </div>
                    <div className={"panel panel-info pole-control "+(IsSearch || !IsControl || controlStyle.maxHeight==0?"hidden":"")} style={{"maxHeight":controlStyle.maxHeight+"px"}}>
                        <div className={"panel-heading "+(controlStyle.maxHeight==0?"hidden":"")}
                             style={{"maxHeight":(controlStyle.maxHeight>40?38:controlStyle.maxHeight)+"px","borderBottom":(controlStyle.maxHeight<=40?0:1)+"px",
                        "paddingBottom":(controlStyle.maxHeight<40?0:10)+"px","paddingTop":(controlStyle.maxHeight<30?0:10)+"px"}}>
                            <h3 className={"panel-title "+(controlStyle.maxHeight<19?"hidden":"")}>{"设备控制"}</h3>
                            <span className={"glyphicon "+ (IsOpenPoleControl?"glyphicon-triangle-bottom ":"glyphicon-triangle-right ")+(controlStyle.maxHeight<27?"hidden":"")} onClick={this.onToggle}></span>
                        </div>
                        <div className={"panel-body "+(!IsOpenPoleControl || controlStyle.maxHeight<=40?"hidden":"")}
                             style={{"maxHeight":(controlStyle.maxHeight>40?controlStyle.maxHeight-40:0)+"px",
                             "paddingBottom":(controlStyle.maxHeight<70?0:15)+"px","paddingTop":(controlStyle.maxHeight<55?0:15)+"px"}}>
                            {
                                this.renderControl(curId)
                            }
                        </div>
                    </div>
                </div>
                <div className="filter-container">
                    <ul className="btn-group">
                        {
                            this.deviceTypes.map(device=>{
                                return <li key={device.id} className={"btn "+(model==device.id?"active":"")} onClick={()=>this.searchDeviceSelect(device.id)}><span className={"icon "+(model==device.id?device.className+"_hover":"")}><span className={device.className}></span></span></li>
                            })
                        }
                    </ul>
                </div>
                <NotifyPopup />
            </Content>
        )
    }
}

// <button type="button" className="close" onClick={()=>this.poleInfoCloseClick()}><span>&times;</span></button>
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
)(SmartLightMap);