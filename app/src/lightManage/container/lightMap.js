/**
 * Created by a on 2017/8/24.
 */
import React,{Component} from 'react';
import {findDOMNode} from 'react-dom'
import Content from '../../components/Content'

import MapView from '../../components/MapView'
import Panel from '../component/FaultPanel'
/*  新增－t  */
import {getDomainList} from '../../api/domain'
import Immutable from 'immutable';
export default class SmartLightMap extends Component{
    constructor(props){
        super(props);
        this.state = {
            deviceId:"lamp",
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
            resDevice:Immutable.fromJS([{id:1, name:"疏影路灯杆1号", lamp:[]},{id:2, name:"疏影路灯杆2号", screen:23, charge:45, camera:56, lamp:89, collect:99},{id:3, name:"疏影路灯杆3号", screen:23, charge:45, camera:56, lamp:89, collect:99}]),
            resPosition:[{"device_id": 1,"device_type": 'DEVICE', lng: 121.49971691534425, lat: 31.239758843127766},{"device_id": 2,"device_type": 'DEVICE', lng: 121.49971691534425, lat: 31.239658843127756},{"device_id": 3,"device_type": 'DEVICE', lng: 121.49971691534425, lat: 31.239558843127756}],
            resDomain:[{}],
            curPosition:[{}],
            curDevice:Immutable.fromJS([]),
            positionList:[],
            searchList:Immutable.fromJS([]),
            deviceList:Immutable.fromJS([]),
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
            }
        }

        this.screen = Immutable.fromJS({})
        this.faultKeys = ["sys_fault", "vram_fault", "disp_module_fault", "disp_module_power_fault", "single_pixel_tube_fault",
            "detection_sys_fault", "ac_fault", "lightning_arrester_fault", "photosensor_fault", "abnormal_temperature_fault",
            "door_switch_fault"];

        this.deviceTypes = [
            {id:"pole", className:"icon_pole"},
            {id:"screen", className:"icon_screen"},
            {id:"camera", className:"icon_camera"},
            {id:"lamp", className:"icon_lamp"},
            {id:"charge", className:"icon_charge"}
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
        this.searchModeHandle = this.searchModeHandle.bind(this);
        this.test = this.test.bind(this)

    }

    componentWillMount(){
        this.mounted = true;
        window.onresize = event=>{
            this.mounted && this.setSize();
        }
        /*  新增－t  */
        getDomainList(data=> {
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
    }
    /*  新增－t  */
    searchInputOnKeyUp(e){
        if (e.keyCode === 13 || e=="toSearch"){}else{return}
        if(this.state.searchMode=="设备"){
            /*  根据input值执行api获取数据  */
            /*  根据返回数据添加到searchList变量中  */
            this.setState({searchList:this.state.resDevice},()=>{});
            this.setState({IsSearchResult:true},()=>{
                this.setState({search:this.state.search.update("value",v=>'')});
                this.setSize();
            });
            // this.state.curDevice._tail.array.map(item=>{
            //     if(item.name.indexOf(e.target.value)!=-1){
            //         this.setState({searchList:this.state.searchList.push(item)},()=>{console.log(this.state.searchList)});
            //     }
            // })
        }else{

        }
    }

    /*  新增－t  */
    searchModeHandle(m){
        if(m==="device"){m="设备"}else{m="域"}
        this.setState({searchMode:m})
    }

    initDomainList(data) {
        let domainList = Object.assign({}, this.state.domainList, {index: 0}, {value: data.length ? data[0].name : ""}, {options: data});
        this.setState({domainList: domainList},()=>{});
        // this.requestSearch();    
    }

    /*  新增－t  */
    test(){
        console.log(this.state.resDevice.toJS())
        console.log(this.state.resPosition)
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

    onChange(key, event){
        switch (key){
            case "search":
                this.setState({search:this.state.search.update("value",v=>event.target.value)});
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
            this.state.resPosition.map((item,index)=>{
                if(item.device_id===id){
                    this.state.resDevice.toJS().map(dItem=>{
                         if(dItem.id===id){
                             let aa = Immutable.fromJS([dItem])
                             this.setState({curDevice:Immutable.fromJS(dItem)})
                             this.setState({deviceList:aa},()=>{});
                         }
                    })
                    let pushCurPosition = [];
                    pushCurPosition.push(item);
                    this.setState({curPosition:pushCurPosition},()=>{});
                }
            })
            //this.setState({searchList:this.state.searchList.push(item)},()=>{console.log(this.state.searchList)});
            this.setSize();
        });
    }

    backHandler(){
        this.setState({IsSearch:true}, ()=>{
            this.setState({searchList:Immutable.fromJS([])});
            this.setSize();
        });
    }

    searchDeviceSelect(id){
        if(this.state.curDevice.get(id)==undefined){/* has not device */ console.log("has not "+id);
        this.test()
        return}
        this.setState({deviceId:id});
    }

    infoDeviceSelect(id){
        this.setState({curId:id, IsOpenFault:false}, ()=>{
            this.setSize();
        });
    }

    searchSubmit(e){
        this.setState({IsSearchResult:true},()=>{
            this.setSize();
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
        const {deviceId, search, IsSearch, IsSearchResult, curDevice, curId, searchList,deviceList,
            listStyle, infoStyle, controlStyle, IsOpenPoleInfo, IsOpenPoleControl,searchMode,curPosition,resPosition,resDevice} = this.state;
        let IsControl = false;
        if(curId=="screen" || curId=="lamp" || curId=="camera"){
            IsControl = true
        }

        return (
            <Content>
                <svg className="svgOnload"> 
                <symbol id="lamp"><path d="M172.383,28.273l0.127-0.127c-31.503-31.489-82.564-31.489-114.067,0C39.709,46.881,35.631,96.968,35.631,96.968
    c-0.453,5.412-2.249,10.625-5.225,15.166c-13.881,12.784-21.039,31.29-19.372,50.087c0.279,3.028-2.931,6.118-2.931,6.118
    c-6.245,6.245-2.549,12.745,3.696,18.735l1.912,1.912c6.245,6.245,12.745,10.068,18.862,3.823c0,0,2.303-3.247,6.118-2.931
    c18.75,1.502,37.143-5.742,49.833-19.627c4.517-2.912,9.683-4.663,15.039-5.098c0,0,50.087-3.951,68.822-22.813
    C203.872,110.837,203.872,59.776,172.383,28.273z M27.092,162.987c-4.592,2.847-12.258-5.653-7.137-10.196
    c6.882-4.716,22.941-16.951,21.921-30.588c-0.075-13.954,1.988-27.837,6.118-41.166c1.674-6.204,12.674-2.037,10.961,3.696
    c-4.277,13.695-6.426,27.966-6.372,42.313C53.856,144.252,33.591,158.908,27.092,162.987z M119.365,152.663
    c-11.946,3.461-24.275,5.43-36.705,5.863h-4.206c-14.274,0-26.255,15.421-30.588,21.921c-1.003,1.632-2.801,2.604-4.716,2.549
    c-1.427,0.02-9.983-4.829-5.863-9.431c3.823-5.863,17.715-25.49,34.411-25.49h5.608c12.969-0.535,27.151-3.008,38.235-6.5
    C120.917,139.708,126.833,150,119.365,152.663z M166.138,133.164c-4.843,4.843-14.784,12.108-18.862,11.47l-0.255,0
    c-32.882-4.843-85.901-59.519-91.126-92.401c-0.573-3.669,5.352-11.052,10.074-15.93c0.28-0.29,5.251,16.052,5.521,15.781
    c0.017-0.017-1.782,3.458,1.015,6.157c0.828,0.676,5.87-2.408,7.601-3.732c1.504-0.846,38.477-22.176,77.166,6.903
    c2.311,2.171,5.561,0.588,3.522-6.079c-4.911-5.57-22.794-16.667-42.044-17.831c-28.333-1.419-46.512,13.657-46.532,13.591
    c-0.029-0.097-1.003-0.141-1.037-0.252c-1.15-3.758-5.038-14.74-4.848-14.925c28.22-26.193,73.49-25.693,99.682,2.527
    C190.792,65.138,190.846,106.405,166.138,133.164z
"/></symbol> 
    <symbol id="charge"><path d="M171.516,183.152h6.507c3.148,0,7.662,1.676,7.662,6.51s-6.042,6.248-7.662,6.248H23.163
    c-3.523-0.708-5.805-4.138-5.097-7.662c0.517-2.571,2.526-4.58,5.097-5.097h6.252V17.288c0-7.046,5.712-12.759,12.759-12.759
    h115.691c7.046,0,13.219,5.675,13.219,12.596S171.516,183.152,171.516,183.152z M158.757,22.264c0-4.764-4.357-5.012-4.721-4.976
    H47.149c-2.369-0.358-4.976,2.337-4.976,4.593v161.271h115.691L158.757,22.264z M131.239,33.887c2.814,0,5.095,2.281,5.095,5.095
    l0,0v5.095c0,2.814-2.281,5.095-5.095,5.095l0,0H69.947c-2.814,0-5.095-2.281-5.095-5.095v-5.095c0-2.814,2.281-5.095,5.095-5.095
    L131.239,33.887z M116.091,63.208l-11.865,44.493h23.878l-41.081,65.256l12.161-45.234H73.082L116.091,63.208z"/></symbol>
<symbol id="screen"><path d="M153.086,4.529c-0.215,0-0.429,0.003-0.644,0.008H47.014C32.968,4.186,21.296,15.288,20.945,29.334
    c-0.005,0.215-0.008,0.429-0.008,0.644v139.925c-0.004,14.051,11.382,25.445,25.433,25.449c0.215,0,0.429-0.003,0.644-0.008h105.429
    c14.046,0.351,25.718-10.751,26.069-24.797c0.005-0.215,0.008-0.429,0.008-0.644V29.978C178.524,15.927,167.137,4.534,153.086,4.529
    z M165.163,169.903c0,7.025-5.695,12.721-12.72,12.721H47.078c0,0,13.69-14.526,13.753-14.481c1.229,0.903,2.714,1.401,4.248,1.417
    c2.121,0.018,4.145-0.887,5.545-2.48l60.844-71.204c2.619-3.062,2.26-7.668-0.802-10.287c-3.062-2.619-7.668-2.26-10.287,0.803
    l-60.844,71.204c-2.552,3.07-2.784,7.077,1.2,10.545c-1.612,1.622-13.721,14.483-13.721,14.483c-7.025,0-12.721-5.695-12.721-12.721
    V29.978c0-7.025,5.695-12.72,12.721-12.72l106.778,0.034c0,0-19.562,15.021-22.208,17.208c-2.833-3.375-8.586-3.26-11.205-0.198
    L70.915,92.665c-0.024,0.028-0.049,0.057-0.072,0.086c-2.575,3.099-2.151,7.698,0.948,10.274c1.302,1.114,2.955,1.734,4.669,1.751
    c2.246,0.07,4.399-0.899,5.836-2.626l49.172-58.364c2.292-2.679,2.303-6.54,0.219-9.218c-0.141-0.181,22.271-17.221,22.271-17.221
    c6.312,0.749,11.206,6.118,11.206,12.631V169.903z
"/></symbol>
<symbol id="camera"><path d="M110.132,159.018c-3.357,0.447-6.782,0.68-10.26,0.685c-3.232-0.005-6.418-0.208-9.546-0.596l-15.639,22.837h51.171
    L110.132,159.018z M100.547,145.847c32.147-0.333,63.89-29.953,63.89-64.053c0-34.293-36.187-65.073-63.625-65.073
    c-0.463-7.91-0.496-12.161-0.469-12.582c0.328,0,1.5,0.021,1.531,0.022c42.1,0.997,75.908,35.436,75.908,77.76
    c-0.112,34.432-22.513,63.603-53.524,73.854L142,181.945h16.591c3.51,1.003,5.542,4.66,4.539,8.17
    c-0.627,2.196-2.344,3.912-4.539,4.539H41.155c-3.65,0-6.609-2.959-6.609-6.609l0,0c0.266-3.45,3.149-6.111,6.609-6.101h17.376
    l17.828-25.899c-31.445-10.02-54.198-39.492-54.141-74.252c0.07-42.958,34.951-77.725,77.909-77.655
    c0.06,2.956,0.529,11.987,0.501,12.587c-33.794,0-65.315,31.195-65.315,65.068S67.667,145.849,100,145.849
    c0.135,0,0.271-0.001,0.406-0.002c0,0-0.512-23.765-0.533-23.765c-22.251,0-40.289-18.038-40.289-40.289
    s18.038-40.289,40.289-40.289c0.028,0,1.065,0,1.065,0s0.104,11.861,0.104,13.345c-16.708,0-28.113,12.904-28.113,26.944
    s10.9,26.944,26.944,26.944s26.944-13.818,26.944-26.944s-10.984-26.944-25.63-26.944c0-1.473-0.228-13.331-0.059-13.326
    c21.67,0.663,39.034,18.439,39.034,40.27l0,0c0,22.209-17.97,40.221-40.163,40.289C99.979,122.082,100.547,145.847,100.547,145.847z
"/></symbol>
<symbol id="collect"><path d="M181.089,5.722h-77.108c-6.847,0-12.397,5.596-12.397,12.501v73.755l-19.986,0.007V33.85c0-5.178-4.163-9.376-9.297-9.376
    H43.704v-6.251c0-6.904-5.55-12.501-12.396-12.501H18.911c-6.847,0-12.397,5.596-12.397,12.501V39.6
    c0,6.904,5.55,12.501,12.397,12.501h12.397c6.847,0,12.397-5.596,12.397-12.501v-5.75h18.596v58.129H43.704v-7.625
    c0-6.904-5.55-12.501-12.397-12.501H18.911c-6.847,0-12.397,5.596-12.397,12.501v30.252c0,6.904,5.55,12.501,12.397,12.501h12.397
    c6.847,0,12.397-5.596,12.397-12.501v-7.625h18.596v58.129H43.704v-5.75c0-6.904-5.55-12.501-12.397-12.501H18.911
    c-6.847,0-12.397,5.596-12.397,12.501v21.376c0,6.904,5.55,12.501,12.397,12.501h12.397c6.847,0,12.397-5.596,12.397-12.501v-6.251
    h18.596c5.135,0,9.297-4.197,9.297-9.376v-58.093l19.614-0.037v73.755c0,6.904,5.55,12.501,12.397,12.501h77.48
    c6.847,0,12.397-5.596,12.397-12.501V18.223C193.486,11.32,187.936,5.722,181.089,5.722z M34.407,39.6
    c0.017,1.822-1.309,3.374-3.099,3.626H18.911c-1.986,0-3.595-1.623-3.595-3.626V18.223c0.25-1.805,1.788-3.143,3.595-3.125h12.397
    c1.616,0.213,2.888,1.496,3.099,3.125V39.6z M34.903,114.605c0,2.002-1.61,3.626-3.595,3.626H18.911
    c-1.986,0-3.595-1.623-3.595-3.626V84.353c0-2.002,1.61-3.626,3.595-3.626h12.397c1.985,0,3.595,1.623,3.595,3.626V114.605z
     M34.903,180.735c0,2.002-1.61,3.626-3.595,3.626H18.911c-1.789-0.252-3.116-1.804-3.099-3.626v-21.376
    c-0.017-1.822,1.309-3.374,3.099-3.626h12.397c1.985,0,3.595,1.623,3.595,3.626V180.735z M184.56,152.083v28.65
    c0,1.933-1.554,3.5-3.471,3.5c0,0-76.217,0-77.108,0c-0.892,0-3.28-1.715-3.471-3.5l0.006-28.671h15.539V173h20.832v-21.006
    l-36.376,0.001v-31.401l15.544-0.01v20.907h20.832v-21.006l-36.376,0V89.062l15.544-0.016v20.935h20.832V88.976l-36.376,0V57.704
    l15.544-0.047v20.816h20.832V57.466l-36.376,0.175v-31.61l15.544,0.016v20.917h20.832V25.958l-36.376,0v-7.735
    c0.191-1.785,1.691-3.135,3.471-3.125h77.108c1.917,0,3.471,1.567,3.471,3.5v7.36h-37.259v21.006h20.832V26.062l16.427,0.016v31.388
    l-37.259,0v21.006h20.832V57.531h16.427v31.445l-37.259,0v21.006h20.832V89.047l16.427,0.047v31.39l-37.259,0v21.006h20.832v-20.944
    h16.427v31.447l-37.259,0V173h20.832v-20.917H184.56z
"/></symbol>
<symbol id="pole"><path d="M88.912,71.751c-3.071-1.667-6.924-0.701-8.838,2.247l-8.621,12.679c-1.518,3.31-0.065,7.223,3.244,8.741
    c2.759,1.265,6.026,0.483,7.913-1.895l8.621-12.679c1.978-2.718,1.378-6.524-1.34-8.502c-0.258-0.188-0.624-0.416-0.908-0.561
    c0,0,1.825-5.416,1.852-5.409c9.933,2.661,20.239,3.317,30.164,2.112c0,0,0.858,5.897,1.041,7.656c0,0-0.114,0.021-0.121,0.022
    c-3.427,0.192-6.152,2.997-6.218,6.457v15.975c-0.704,3.501,1.564,6.91,5.065,7.613c3.501,0.704,6.91-1.564,7.613-5.065
    c0.169-0.841,0.169-1.707,0-2.548V82.619c-0.061-3.449-2.769-6.268-6.212-6.466c-0.039,0.001-1.102-7.684-1.102-7.684
    c9.896-1.227,18.52-3.312,27.324-8.125c0,0,4.484,4.857,5.281,6.266c-0.297,0.188-0.56,0.398-0.571,0.406
    c-2.552,1.976-3.281,5.594-1.581,8.432c0.327,0.546,0.732,1.04,1.204,1.467l9.889,12.045c1.836,3.063,5.807,4.058,8.87,2.223
    c3.063-1.836,4.058-5.807,2.223-8.87c-0.327-0.546-0.732-1.04-1.204-1.467l-9.889-12.045c-1.836-3.063-5.807-4.058-8.87-2.223
    c-0.097,0.058-5.281-6.262-5.281-6.262c7.707-2.981,32.041-23.148,23.041-41.144c-6.984-12.152-21.707-17.506-34.866-12.679
    L45.506,41.358V22.974c-0.002-4.131-3.353-7.479-7.484-7.477c-4.129,0.002-7.475,3.348-7.477,7.477v164.821
    c0.002,4.131,3.353,7.479,7.484,7.477c4.129-0.002,7.475-3.348,7.477-7.477V58.25c66.714-26.251,66.593-27.593,94.161-37.75
    c2.155,0,15.189-4.382,19.5,5c0.833,2,0.076,6.275-2.5,10.167C140.333,57,113.31,60.473,90.85,52.951
    c-3.07-0.937-6.363,0.521-7.734,3.423c-1.368,3.525,0.381,7.492,3.906,8.859c0.133,0.052,0.268,0.099,0.404,0.142
    c1.071,0.34,2.24,0.644,3.321,0.936C90.776,66.32,88.912,71.751,88.912,71.751z
"/></symbol>


            </svg>
                <MapView mapData={{id:"lightMap", position:curPosition, data:deviceList.toJS()}}/>
                <div className="search-container">
                    <div className="input-group searchBlock">
                      <input type="search" ref="searchInput" className="form-control" placeholder="搜索名称或域" value={search.get("value")} onKeyUp={(event)=>{this.searchInputOnKeyUp(event)}} onChange={(event)=>{this.onChange("search", event)}}/>
                      <div className="input-group-btn">
                        <button type="button" className="btn btn-default" aria-label="search" onClick={()=>this.searchInputOnKeyUp("toSearch")}><span className="glyphicon glyphicon-search"></span></button>
                        <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{searchMode}</button>
                        <ul className="dropdown-menu dropdown-menu-right">
                          <li><a onClick={()=>this.searchModeHandle("device")}>设备</a></li>
                          <li><a onClick={()=>this.searchModeHandle("domain")}>域</a></li>
                          <li><a onClick={()=>this.test()}>test</a></li>
                        </ul>
                      </div>
                    </div>
                    <ul className={"list-group "+(IsSearch && IsSearchResult?"":"hidden")} style={listStyle}>
                        {
                            searchList.map(pole=>{
                                return <li key={pole.get("id")} className="list-group-item" onClick={()=>this.itemClick(pole.get("id"))}>
                                    {pole.get("name")}
                                    {pole.get("collect") && <span className=""><svg><use xlinkHref={"#collect"} transform="scale(0.08,0.08)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg></span>}
                                    {pole.get("charge") && <span className=""><svg><use xlinkHref={"#charge"} transform="scale(0.08,0.08)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg></span>}
                                    {pole.get("camera") && <span className=""><svg><use xlinkHref={"#camera"} transform="scale(0.08,0.08)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg></span>}
                                    {pole.get("lamp") && <span className=""><svg><use xlinkHref={"#lamp"} transform="scale(0.08,0.08)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg></span>}
                                    {pole.get("screen") && <span className=""><svg><use xlinkHref={"#screen"} transform="scale(0.08,0.08)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg></span>}
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
                                {curDevice.get("lamp") && <li className={(infoStyle.maxHeight<88?"hidden ":" ")+(curId=="lamp"?"btn btn-primary":"")} onClick={()=>this.infoDeviceSelect("lamp")}><span className={"this"+(curId=="lamp"?"_hover":"")}><svg><use xlinkHref={"#lamp"} transform="scale(0.075,0.075)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg></span></li>}
                                {curDevice.get("camera") && <li className={(infoStyle.maxHeight<88?"hidden ":" ")+(curId=="camera"?"btn btn-primary":"")} onClick={()=>this.infoDeviceSelect("camera")}><span className={"this"+(curId=="camera"?"_hover":"")}><svg><use xlinkHref={"#camera"} transform="scale(0.075,0.075)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg></span></li>}
                                {curDevice.get("charge") && <li className={(infoStyle.maxHeight<88?"hidden ":" ")+(curId=="charge"?"btn btn-primary":"")} onClick={()=>this.infoDeviceSelect("charge")}><span className={"this"+(curId=="charge"?"_hover":"")}><svg><use xlinkHref={"#charge"} transform="scale(0.075,0.075)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg></span></li>}
                                {curDevice.get("collect") && <li className={(infoStyle.maxHeight<88?"hidden ":" ")+(curId=="collect"?"btn btn-primary":"")} onClick={()=>this.infoDeviceSelect("collect")}><span className={"this"+(curId=="collect"?"_hover":"")}><svg><use xlinkHref={"#collect"} transform="scale(0.075,0.075)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg></span></li>}
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
                                return <li key={device.id} className={"btn "+(deviceId==device.id?"btn-primary":"")} onClick={()=>this.searchDeviceSelect(device.id)}><svg><use xlinkHref={"#"+device.id} transform="scale(0.075,0.075)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg></li>
                            })
                        }
                    </ul>
                </div>
            </Content>
        )
    }
}