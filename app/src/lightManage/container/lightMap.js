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
import NotifyPopup from '../../common/containers/NotifyPopup';
import {addNotify, removeAllNotify, removeNotify} from '../../common/actions/notifyPopup';
import {getDomainList} from '../../api/domain'
import {getObjectByKey} from '../../util/index'
import {getPoleListByModelWithName, getPoleAssetById} from '../../api/pole'
import {getIndexByKey} from '../../util/algorithm'
import Immutable from 'immutable';
export class lightMap extends Component{
    constructor(props){
        super(props);
        this.state = {

            /* 新增－20170915 */
            model:"pole",
            interactive:false,
            tableIndex: 0,
            mapLatlng:{lng: 121.49971691534425, lat: 31.239658843127756},

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

            listStyle:{"maxHeight":"200px"},
            infoStyle:{"maxHeight":"352"},
            controlStyle:{"maxHeight":"180"},
            IsOpenPoleInfo:true,
            IsOpenPoleControl:true,

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
            domainList: {
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

        this.screen = Immutable.fromJS({})
        this.faultKeys = ["sys_fault", "vram_fault", "disp_module_fault", "disp_module_power_fault", "single_pixel_tube_fault",
            "detection_sys_fault", "ac_fault", "lightning_arrester_fault", "photosensor_fault", "abnormal_temperature_fault",
            "door_switch_fault"];

        this.deviceTypes = [
            {id:"pole", className:"icon_pole"},
            {id:"screen", className:"icon_screen"},
            {id:"camera", className:"icon_camera"},
            {id:"lamp", className:"icon_led_light"},
            {id:"charge", className:"icon_charge_pole"}
        ];

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

        this.updateCameraVideo = this.updateCameraVideo.bind(this);


        /*  新增－t  */
        this.initDomainList = this.initDomainList.bind(this);
        this.searchInputOnKeyUp=this.searchInputOnKeyUp.bind(this);

        /*  新增－t－20170915  */
        this.searchPromptList = [{id:"device", value:"设备"},{id:"domain", value:"域"}];
        this.requestSearch = this.requestSearch.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.updateSearch = this.updateSearch.bind(this);
        this.requestPoleAsset = this.requestPoleAsset.bind(this);
        this.updatePoleAsset = this.updatePoleAsset.bind(this);
        this.domainList = [];
        this.stopProp = this.stopProp.bind(this);
        this.isMouseEnterSet = this.isMouseEnterSet.bind(this);


        this.test = this.test.bind(this);

    }

    componentWillMount(){
        this.mounted = true;
        window.onresize = event=>{
            this.mounted && this.setSize();
        }
        /*  新增－t  */
        getDomainList(data=>{
            if(this.mounted){
                this.domainList = data;
            }
            this.mounted && this.initDomainList(data)
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
        if (e.keyCode === 13 || e=="toSearch"){}else{return}
        if(this.state.searchMode=="设备"){
            /*  先在已经请求到的域内的所有设备中寻找  */
            let searchObj = this.state.resDevice.toJS();
            let num = searchObj.length-1;
            let list = [];
            searchObj.map((item,index)=>{
                    if(item.name.indexOf(this.state.search.get("value"))>0){
                        list.push(item)
                    }
                    if(index==num){this.setState({searchList:Immutable.fromJS(list)},()=>{
                            console.log("success")
                    })};
            })
            /*  如没有找到则根据input值执行api获取数据  */
            /*  根据返回数据添加到searchList变量中  */
            //  this.setState({searchList:this.state.resDevice},()=>{});
            this.setState({IsSearchResult:true},()=>{
                this.setState({search:this.state.search.update("value",v=>'')});
                this.setSize();
            });
            //  this.state.curDevice._tail.array.map(item=>{
            //     if(item.name.indexOf(e.target.value)!=-1){
            //         this.setState({searchList:this.state.searchList.push(item)},()=>{console.log(this.state.searchList)});
            //     }
            // })
        }else{

        }
    }

    /*  新增－t－20170915  */
    requestSearch(){
        const {model, search, tableIndex} = this.state;
        let searchType = this.searchPromptList[tableIndex].id;
        if(searchType=="domain"){
            let curDomain = getObjectByKey(this.domainList, 'name', search.get("value"));
            if(curDomain){
                getPoleListByModelWithName(searchType, model, curDomain.id, (data)=>{this.mounted && this.updateSearch(data)});
            }else{
                this.props.actions.addNotify(0, "没有找到匹配域");
                this.setState({IsSearchResult:false});
            }
            return;
        }
        getPoleListByModelWithName(searchType, model, search.get("value"), (data)=>{this.mounted && this.updateSearch(data)});
    }

    updateSearch(data){
        const {tableIndex} = this.state;
        let searchType = this.searchPromptList[tableIndex].id;
        if(data[0]){}else{
            if(searchType=="domain"){
                this.props.actions.addNotify(0, "域内无绑定设备");
            }else{
                this.props.actions.addNotify(0, "未找到设备");
            }   
            return;
        }
        let searchList = Immutable.fromJS(data);
        let deviceList=[];
        let positionList = data.map((pole)=>{
            let latlng = pole.geoPoint; 
            deviceList.push({"id": pole.id,"name": pole.name});
            return Object.assign({}, {"device_id": pole.id,"device_type": 'DEVICE'}, latlng);
        });

        if(data && data.length){
            let fPole = data[0];
            let flatlng = fPole.geoPoint;
            this.setState({searchList:searchList, mapLatlng:flatlng,positionList:positionList,deviceList:deviceList}, ()=>{
                this.requestPoleAsset(data);
            });
        }else{
            this.setState({searchList:searchList, positionList:positionList, deviceList:deviceList}, ()=>{
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
        let positionList = this.state.positionList;
        let deviceList = this.state.deviceList;

        if(!asset){
            asset = {}
        }else{}

        if(!data[0]){
            positionList = positionList.filter(item => {if (item.device_id != id) {return item }})
            deviceList = deviceList.filter(item => {if (item.id == id) {return item }})
            return;
        }

        data.map(ass=>{
            if(ass.extendType == "screen"||ass.extendType == "xes"||ass.extendType == "camera"||ass.extendType == "charge"){
                //this.setState({positionList: this.state.positionList.filter(item => {if (item.device_id != id) {return item }}),deviceList: deviceList.filter(item => {if (item.id == id) {return item}})},()=>{})
                positionList = positionList.filter(item => {if (item.device_id != id) {return item }})
                deviceList = deviceList.filter(item => {if (item.id == id) {return item }})
                return;
            }else if(ass.extendType == "lc"){
                deviceList.map((o,i)=>{ if(o.id==id){deviceList[i]["lamp"]=ass.id} })
                asset = Object.assign({}, asset, {lamp:ass});
            }else{}
        })

        /* 列出搜索项 */
        this.setState({IsSearchResult:true, deviceList:deviceList, positionList:positionList, searchList:this.state.searchList.updateIn([curIndex, "asset"], v=>Immutable.fromJS(asset))},()=>{});
        // this.setState({searchList:this.state.searchList.updateIn([curIndex, "asset"], v=>Immutable.fromJS(asset)),curPosition:this.state.positionList,curDevice:Immutable.fromJS(this.state.deviceList)},()=>{
        // });

    }

    initDomainList(data) {
        let domainList = Object.assign({}, this.state.domainList, {index: 0}, {value: data.length ? data[0].name : ""}, {options: data});
        this.setState({domainList: domainList},()=>{});
        // this.requestSearch();    
    }

    /*  新增－t  */
    test(){
        this.setState({isMouseEnter:false},()=>{});
        setTimeout(()=>{
                if(this.state.isMouseEnter==true){return}else if(this.state.IsSearchResult==true||this.state.interactive==true){
                    this.setState({IsSearchResult:false,interactive:false});
                }
        }, 2000)
        
        // let aaaa = this.state.searchList
        // aaaa.map((item,index)=>{
        //     if(index==1){
        //         console.log(item.get("asset"))
        //         console.log(item.get(["asset","lamp"]))
        //     }
        // })

    }

    isMouseEnterSet(){
        this.setState({isMouseEnter:true},()=>{});
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

    onBlur(event){
        this.setState({interactive:false,IsSearchResult:false});
        //this.timeOut = setTimeout(()=>{this.setState({interactive:false,IsSearchResult:false});}, 1000)
    }

    stopProp(event){
        event.nativeEvent.stopPropagation();
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

    faultClick(event){
        this.setState({IsOpenFault: true, faultStyle:{"top":(event.pageY+20)+"px"}});
    }

    submit(key){
    }

    itemClick(id){
        this.setState({IsSearch:false, IsOpenFault:false, IsOpenPoleInfo:true, IsOpenPoleControl:true},()=>{
            /* 根据id将设备position项塞进curPosition */
            this.state.positionList.map((item,index)=>{
                if(item.device_id===id){
                    
                    let itemLst = []
                    itemLst.push(item)
                    this.setState({curPosition:itemLst},()=>{})

                    this.state.deviceList.map(dItem=>{
                         if(dItem.id===id){
                            let dItemLst = []
                            dItemLst.push(dItem)
                            this.setState({curDevice:Immutable.fromJS(dItemLst)})
                         }
                    })
                }
            })
            //this.setState({searchList:this.state.searchList.push(item)},()=>{console.log(this.state.searchList)});
            this.setSize();
        });
    }

    backHandler(){
        this.setState({IsSearch:true,IsSearchResult:true}, ()=>{
            this.setSize();
        });
    }

    searchDeviceSelect(id){
        var device = this.state.curDevice.toJS();
        device=device[0];
        if(!device[id]&&id!="pole"){console.log("has not "+id); return
        }else if(id=="pole"){console.log(this.state.searchList.toJS());this.setState({deviceId:id, IsSearch:true, IsSearchResult:false, IsOpenFault:false});
        }else{console.log("lcId: "+device[id]);this.setState({deviceId:id, IsSearch:true, IsSearchResult:false, IsOpenFault:false});
        }
    }

    infoDeviceSelect(id){
        this.setState({curId:id, IsOpenFault:false}, ()=>{
            this.setSize();
        });
    }

    searchSubmit(index){
        this.setState({interactive:false, tableIndex:index},()=>{
            this.requestSearch();
        });
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
                            <div className="fault-container"><span className="name">{this.formatIntl('fault')}:</span><span onClick={(event)=>{faultList.length>0 && this.faultClick(event)}}>{faultList.length>0?"故障":"运行正常"}</span></div>
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
                            {this.renderState(props, "online", "在线状态", true)}
                            {this.renderState(props, "brightness", "当前亮度")}
                            {
                                <div className="fault-container"><span className="name">{this.formatIntl('工作状态')}:</span><span onClick={(event)=>{faultList.length>0 && this.faultClick(event)}}>{faultList.length>0?"故障":"运行正常"}</span></div>
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
                return <div className="row state-control camera">
                    <div className="col-sm-12 video">
                        <canvas ref="camera">
                        </canvas>
                    </div>
                    <div className="col-sm-12 form-group focus">
                        <label className="col-sm-3">变焦:</label>
                        <div className="col-sm-9">
                            <input  type="range" min="0" max="100" step="1" value={camera.get("focus")} onChange={event=>this.onChange("focus", event)}/>
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
        const {deviceId, search, interactive, IsSearch, IsSearchResult, curDevice, curId, searchList,deviceList, tableIndex,
            listStyle, infoStyle, controlStyle, positionList, mapLatlng, IsOpenPoleInfo, IsOpenPoleControl,searchMode,curPosition,resPosition,resDevice} = this.state;
        let IsControl = false;  
        if(curId=="screen" || curId=="lamp" || curId=="camera"){
            IsControl = true
        }

        return (
            <Content onClick={()=>{}}>
                <MapView mapData={{id:"lightMap", latlng:mapLatlng, position:curPosition, data:curDevice.toJS()}}/>
                <div className="search-container" onMouseLeave={()=>{this.test()}} onMouseEnter={()=>{this.isMouseEnterSet()}}>
                    <div className="input-group searchBlock">
                      <input type="search" ref="searchInput" className="form-control" placeholder="搜索名称或域" value={search.get("value")} onKeyUp={(event)=>{this.searchInputOnKeyUp(event)}} onChange={(event)=>{this.onChange("search", event)}}/>
                      <span className="glyphicon glyphicon-search form-control-feedback" aria-hidden="true"></span>

                    </div>
                    <ul className={"list-group mode-select "+(interactive?'select-active':'')} >
                            {
                                this.searchPromptList.map((item, index)=>{
                                    return <li className={"list-group-item "+(index==tableIndex?"":"")} key={index} value={item.value} onClick={()=>this.searchSubmit(index)}>{item.value}<span></span> {search.get("value")}</li>
                                })
                            }
                    </ul>
                    <ul className={"list-group "+(IsSearch && IsSearchResult?"":"hidden")} style={listStyle}>
                        {
                            searchList.map(pole=>{
                                return <li key={pole.get("id")} className="list-group-item" onClick={()=>this.itemClick(pole.get("id"))}>
                                    {pole.get("name")}
                                    {pole.getIn(["asset","collect"]) && <span className=""><svg><use xlinkHref={"#icon_collect"} transform="scale(0.08,0.08)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg></span>}
                                    {pole.getIn(["asset","charge"]) && <span className=""><svg><use xlinkHref={"#icon_charge_pole"} transform="scale(0.08,0.08)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg></span>}
                                    {pole.getIn(["asset","camera"]) && <span className=""><svg><use xlinkHref={"#icon_camera"} transform="scale(0.08,0.08)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg></span>}
                                    {pole.getIn(["asset","lamp"]) && <span className=""><svg><use xlinkHref={"#icon_led_light"} transform="scale(0.08,0.08)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg></span>}
                                    {pole.getIn(["asset","screen"]) && <span className=""><svg><use xlinkHref={"#screen"} transform="scale(0.08,0.08)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg></span>}
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
                         style={Object.assign({"marginBottom":(controlStyle.maxHeight>0?20:0)+"px"},{"maxHeight":infoStyle.maxHeight+"px"})}>
                        <div className={"panel-heading "+(infoStyle.maxHeight==0?"hidden":"")} style={{"maxHeight":(infoStyle.maxHeight>40?40:infoStyle.maxHeight)+"px"}}>
                            <h3 className={"panel-title "+(infoStyle.maxHeight<30?"hidden":"")}>{curDevice.get("name")}</h3>
                            <button type="button" className="close" onClick={()=>this.poleInfoCloseClick()}><span>&times;</span></button>
                        </div>
                        <div className={"panel-body "+(infoStyle.maxHeight<40?"hidden":"")} style={{"maxHeight":(infoStyle.maxHeight>40?infoStyle.maxHeight-40:0)+"px"}}>
                            <ul className="btn-group">
                                {curDevice.get("screen") && <li className={(infoStyle.maxHeight<88?"hidden ":" ")+(curId=="screen"?"btn btn-primary":"")} onClick={()=>this.infoDeviceSelect("screen")}><svg><use xlinkHref={"#screen"} transform="scale(0.075,0.075)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg></li>}
                                {curDevice.get("lamp") && <li className={(infoStyle.maxHeight<88?"hidden ":" ")+(curId=="lamp"?"btn btn-primary":"")} onClick={()=>this.infoDeviceSelect("lamp")}><span className={"this"+(curId=="lamp"?"_hover":"")}><svg><use xlinkHref={"#icon_led_light"} transform="scale(0.075,0.075)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg></span></li>}
                                {curDevice.get("camera") && <li className={(infoStyle.maxHeight<88?"hidden ":" ")+(curId=="camera"?"btn btn-primary":"")} onClick={()=>this.infoDeviceSelect("camera")}><span className={"this"+(curId=="camera"?"_hover":"")}><svg><use xlinkHref={"#icon_camera"} transform="scale(0.075,0.075)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg></span></li>}
                                {curDevice.get("charge") && <li className={(infoStyle.maxHeight<88?"hidden ":" ")+(curId=="charge"?"btn btn-primary":"")} onClick={()=>this.infoDeviceSelect("charge")}><span className={"this"+(curId=="charge"?"_hover":"")}><svg><use xlinkHref={"#icon_charge_pole"} transform="scale(0.075,0.075)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg></span></li>}
                                {curDevice.get("collect") && <li className={(infoStyle.maxHeight<88?"hidden ":" ")+(curId=="collect"?"btn btn-primary":"")} onClick={()=>this.infoDeviceSelect("collect")}><span className={"this"+(curId=="collect"?"_hover":"")}><svg><use xlinkHref={"#icon_collect"} transform="scale(0.075,0.075)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg></span></li>}
                            </ul>
                            {
                                this.renderInfo(curId,this.state[curId])
                            }
                        </div>
                    </div>
                    <div className={"panel panel-info pole-control "+(IsSearch || !IsControl || controlStyle.maxHeight==0?"hidden":"")} style={{"maxHeight":controlStyle.maxHeight+"px"}}>
                        <div className={"panel-heading "+(controlStyle.maxHeight==0?"hidden":"")}
                             style={{"maxHeight":(controlStyle.maxHeight>40?40:controlStyle.maxHeight)+"px","borderBottom":(controlStyle.maxHeight<=40?0:1)+"px",
                        "paddingBottom":(controlStyle.maxHeight<40?0:12)+"px","paddingTop":(controlStyle.maxHeight<30?0:12)+"px"}}>
                            <h3 className={"panel-title "+(controlStyle.maxHeight<19?"hidden":"")}>{"设备控制"}</h3>
                            <span className={"glyphicon "+ (IsOpenPoleControl?"glyphicon-triangle-bottom ":"glyphicon-triangle-right ")+(controlStyle.maxHeight<27?"hidden":"")} onClick={this.onToggle}></span>
                        </div>
                        <div className={"panel-body "+(!IsOpenPoleControl || controlStyle.maxHeight<=40?"hidden":"")}
                             style={{"maxHeight":(controlStyle.maxHeight>40?controlStyle.maxHeight-40:0)+"px",
                             "paddingBottom":(controlStyle.maxHeight<70?0:0)+"px","paddingTop":(controlStyle.maxHeight<55?0:0)+"px"}}>
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
                                return <li key={device.id} className={"btn "+(deviceId==device.id?"btn-primary":"btn-default")} onClick={()=>this.searchDeviceSelect(device.id)}><svg><use xlinkHref={"#"+device.className} transform="scale(0.075,0.075)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg></li>
                            })
                        }
                    </ul>
                </div>
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