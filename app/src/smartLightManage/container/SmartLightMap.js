/**
 * Created by a on 2017/8/24.
 */
import React,{Component} from 'react';
import Content from '../../components/Content'

import MapView from '../../components/MapView'

import Immutable from 'immutable';
export default class SmartLightMap extends Component{
    constructor(props){
        super(props);
        this.state = {
            deviceId:"pole",
            IsSearch: false,
            IsSearchResult: true,
            curDevice:Immutable.fromJS({
              id:1, name:"疏影路灯杆1号", screen:23, charge:45, camera:56, lamp:89, collect:99
            }),
            curId:"screen",
            searchList:Immutable.fromJS([
                {id:1, name:"疏影路灯杆1号", screen:23, charge:45, camera:56, lamp:89, collect:99},
                {id:2, name:"疏影路灯杆21号", screen:23,  camera:56, lamp:89, collect:99},
                {id:3, name:"疏影路灯杆3号", screen:23,  lamp:89, collect:99},
                {id:4, name:"疏影路灯杆4号", lamp:89, collect:99}
            ]),
            faultList: [],
            faultStyle: {"top": "280px"},
            IsOpenFault: false,

            listStyle:{"maxHeight":"200px"},
            infoStyle:{"maxHeight":"314"},
            controlStyle:{"maxHeight":"120"}
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

        this.renderInfo = this.renderInfo.bind(this);
        this.renderState = this.renderState.bind(this);
        this.renderControl = this.renderControl.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);

        this.setSize = this.setSize.bind(this);

        this.updateCameraVideo = this.updateCameraVideo.bind(this);
    }

    componentWillMount(){
        this.mounted = true;
        window.onresize = event=>{
            this.mounted && this.setSize();
        }
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

    setSize(){
        const {IsSearch} = this.state;
        let height = window.innerHeight;

        if(IsSearch){
            let listStyle = {"maxHeight":(height<145?0:height-145)+"px"};
            this.setState({listStyle:listStyle});
        }else{
            let defaultHeight = 0;
            if(this.refs.poleInfo){
                defaultHeight = this.refs.poleInfo;
            }
            // console.log("domNode:",defaultHeight.style.height);
            let infoStyle = {"maxHeight":(height<230?0:height-230)};
            let controlStyle = {"maxHeight":(height<602?0:height-602)};
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

    searchSubmit(e){

    }

    transformState(key, sf){
        if(key == 'wind-direction'){
            // return this.formatIntl('app.'+sf);
            return <span className="glyphicon glyphicon-arrow-up" style={{transform:`rotate(${sf}deg)`}}></span>
        }

        if(key == 'brightness_mode'){
            return this.formatIntl(sf ? 'app.manual' : 'app.environment-brightness-control');
        }

        return this.formatIntl(sf ? 'app.abnormal':'app.normal');
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
        if(parentPro && parentPro.has(key)){
            if(key == 'wind-direction'){
                return <div key={key} className="pro"><span>{name ? this.formatIntl('app.'+name):key}:</span>{this.transformState(key, parentPro.get(key))}</div>
            }

            if(key == 'o2'){
                return <div key={key} className="pro"><span>{name ? this.formatIntl('app.'+name):key}:</span>{(parentPro.get(key))+(unit ? ' %'+unit:'')}</div>
            }
            return <div key={key} className="pro"><span>{name ? this.formatIntl('app.'+name):key}:</span>{(IsTransform ? this.transformState(key, parentPro.get(key)): parentPro.get(key))+(unit ? ' '+unit:'')}</div>
        }
    }

    renderInfo(id, props){
        switch(id){
            case "screen":
                const {faultList, faultStyle,IsOpenFault} = this.state;
                return <div className="row state-info screen">
                    <div className="col-sm-6 prop">
                        {this.renderState(props, "width", "width")}
                        {this.renderState(props, "height", "height")}
                        {this.renderState(props, "version", "version")}
                        {this.renderState(props, "brightness_mode", "brightness_mode", true)}
                        {this.renderState(props, "brightness", "brightness")}
                        {
                            <div className="fault-container"><span className="name">{this.formatIntl('app.fault')}:</span><span className={faultList.length>0?"fault":"pass"} onClick={(event)=>{faultList.length>0 && this.faultClick(event)}}></span></div>
                        }
                        {
                            faultList.length>0 &&
                            <Panel refs="faultPanel" style={faultStyle} className={IsOpenFault?'':'hidden'} title={this.formatIntl('app.fault_info')} closeBtn={true}
                                   closeClick={this.closeClick}>
                                {
                                    faultList.map(key=>{
                                        return <div key={key}>{this.formatIntl("app."+key)}</div>
                                    })
                                }
                            </Panel>
                        }
                    </div>
                    <div className="col-sm-6 img-container"><img src="http://localhost:8080/images/smartLight/screen_test.png"/></div>
                </div>
        }
    }
    renderControl(id){
        switch(id){
            case "screen":
                return <div className="row state-control screen">
                        <div className="col-sm-12 form-group switch">
                            <label className="col-sm-4">显示屏开关:</label>
                            <select className="col-sm-4">
                            </select>
                            <button className="col-sm-3 btn btn-primary padding-left">应用</button>
                        </div>
                        <div className="col-sm-12 form-group time-table">
                            <label className="col-sm-4">时间表1</label>
                            <select className="col-sm-4">
                            </select>
                            <button className="col-sm-3 btn btn-primary">应用</button>
                        </div>
                    </div>
            case "camera":
                return <div className="row state-control camera">
                    <div className="col-sm-12 video">
                        <canvas ref="camera">
                        </canvas>
                    </div>
                    <div className="col-sm-12 form-group focus">
                        <label className="col-sm-3">变焦:</label>
                        <div className="col-sm-9">
                            <input  type="range" min="0" max="100" step="1" value="60" onChange={()=>{}}/>
                        </div>
                    </div>
                    <div className="col-sm-12 form-group preset">
                        <label className="col-sm-3">预置:</label>
                        <select className="col-sm-6">
                        </select>
                        <button className="col-sm-3 btn btn-primary">切换</button>
                    </div>
                </div>
            case "lamp":
                return <div className="row state-control lamp">
                        <div className="col-sm-12 form-group switch">
                            <label className="col-sm-4">灯开关:</label>
                            <select className="col-sm-4">
                            </select>
                            <button className="col-sm-3 btn btn-primary">应用</button>
                        </div>
                        <div className="col-sm-12 form-group strategy">
                            <label className="col-sm-4">策略调光:</label>
                            <select className="col-sm-4">
                            </select>
                            <button className="col-sm-3 btn btn-primary">应用</button>
                        </div>
                        <div className="col-sm-12 form-group group">
                            <label className="col-sm-4">整组调光:</label>
                            <label className="col-sm-8 checkbox-inline">
                                <input type="checkbox"/>
                                {"疏影路组"}
                            </label>
                        </div>
                        <div className="col-sm-12 form-group handler">
                            <label className="col-sm-4">手动调光:</label>
                            <div className="col-sm-8">
                                <input  type="range" min="0" max="100" step="1" value="60" onChange={()=>{}}/>
                            </div>
                        </div>
                    </div>
        }
    }

    render(){
        const {deviceId, IsSearch, IsSearchResult, curDevice, curId, searchList, listStyle, infoStyle, controlStyle} = this.state;
        return (
            <Content>
                <MapView mapData={{id:"smartLightMap"}}/>
                <div className="search-container">
                    <div className="searchText">
                        <input type="search" className="form-control" placeholder="搜索名称或域" onChange={()=>{}}/>
                        <span className="glyphicon glyphicon-search" onClick={this.searchSubmit}></span>
                    </div>
                    <ul className={"list-group "+(IsSearch && IsSearchResult?"":"hidden")} style={listStyle}>
                        {
                            searchList.map(pole=>{
                                return <li key={pole.get("id")} className="list-group-item">
                                    {pole.get("name")}

                                    {pole.get("collect") && <span className="icon icon_collect"></span>}
                                    {pole.get("charge") && <span className="icon icon_charge"></span>}
                                    {pole.get("camera") && <span className="icon icon_camera"></span>}
                                    {pole.get("lamp") && <span className="icon icon_lamp"></span>}
                                    {pole.get("screen") && <span className="icon icon_screen"></span>}
                                </li>
                            })
                        }
                    </ul>

                    <div className={"margin-top margin-bottom search-back "+(IsSearch?"hidden":"")} style={{"marginBottom":(infoStyle.maxHeight>0?15:0)+"px"}}>
                        <span className="glyphicon glyphicon-menu-left padding-left padding-right"></span>
                        <span className="name">{"返回搜索结果"}</span>
                    </div>
                    <div ref="poleInfo" id="poleInfo" className={"panel panel-info pole-info "+(IsSearch || infoStyle.maxHeight==0?"hidden":"")} style={Object.assign({"marginBottom":(controlStyle.maxHeight>0?20:0)+"px"},{"maxHeight":infoStyle.maxHeight+"px"})}>
                        <div className={"panel-heading "+(infoStyle.maxHeight==0?"hidden":"")} style={{"maxHeight":(infoStyle.maxHeight>40?38:infoStyle.maxHeight)+"px"}}>
                            <h3 className="panel-title">{curDevice.get("name")}</h3>
                        </div>
                        <div className={"panel-body "+(infoStyle.maxHeight<40?"hidden":"")} style={{"maxHeight":(infoStyle.maxHeight>40?infoStyle.maxHeight-40:0)+"px"}}>
                            <ul className="btn-group">
                                {curDevice.get("screen") && <li className={" "+"active"}><span className="icon icon_screen_hover"></span></li>}
                                {curDevice.get("lamp") && <li className={" "+""}><span className="icon icon_lamp"></span></li>}
                                {curDevice.get("camera") && <li className={" "+""}><span className="icon icon_camera"></span></li>}
                                {curDevice.get("charge") && <li className={" "+""}><span className="icon icon_charge"></span></li>}
                                {curDevice.get("collect") && <li className={" "+""}><span className="icon icon_collect"></span></li>}
                            </ul>
                            {
                                this.renderInfo(curId,Immutable.fromJS({}))
                            }
                        </div>
                    </div>
                    <div className={"panel panel-info pole-control "+(IsSearch || controlStyle.maxHeight==0?"hidden":"")} style={{"maxHeight":controlStyle.maxHeight+"px"}}>
                        <div className={"panel-heading "+(controlStyle.maxHeight==0?"hidden":"")} style={{"maxHeight":(controlStyle.maxHeight>40?38:controlStyle.maxHeight)+"px"}}>
                            <h3 className="panel-title">{"设备控制"}</h3>
                            <span className="glyphicon glyphicon-triangle-bottom"></span>
                        </div>
                        <div className={"panel-body "+(controlStyle.maxHeight<40?"hidden":"")} style={{"maxHeight":(controlStyle.maxHeight>40?controlStyle.maxHeight-40:0)+"px"}}>
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
                                return <li key={device.id} className={"btn "+(deviceId==device.id?"active":"")}><span className={"icon "+device.className+(deviceId==device.id?"_hover":"")}></span></li>
                            })
                        }
                    </ul>
                </div>
            </Content>
        )
    }
}