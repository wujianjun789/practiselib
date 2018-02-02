/**
 * Created by a on 2017/10/19.
 */
import React,{Component} from 'react';
import {findDOMNode} from 'react-dom';
import {injectIntl} from 'react-intl';

import '../../../public/styles/mediaPublish-map.less';

import Content from '../../components/Content';
import MapView from '../../components/MapView';
import Page from '../../components/Page';

import Immutable from 'immutable';
export  class MediaPublishMap extends Component{
    constructor(props){
        super(props);
        this.state = {
            IsSearch: true,
            IsSearchResult: false,

            map:{
                id: "mediaPublishMap",
                latlng: []
            },
            search:Immutable.fromJS({placeholder:'输入屏名称搜索', value:''}),
            searchList: Immutable.fromJS([{id:1, name:'屏幕1号'},{id:2, name:'屏幕2号'}]),

            page: Immutable.fromJS({
                pageSize: 10,
                current: 1,
                total: 2,
            }),

            curDevice:Immutable.fromJS({id:1, name:'屏幕1号'}),

            screen:Immutable.fromJS({width:192, height:576, online:1, brightness:100, "brightness_mode":"环境亮度", "switch_power":1, timeTable:"time1", faultList:["sys_fault"]}),
            screenSwitch:{list:[{id:'open', value:'开'},{id:'close', value:'关'}], id:'open'},
            playerList:{list:[{id:1, name:'播放列表1'}, {id:2, name:'播放列表2'}], id:1, name:'播放列表1'},

            IsOpenPoleInfo:true,
            IsOpenPoleControl:true,
            IsOpenPreview: false,

            listStyle:{"maxHeight":"200px"},
            infoStyle:{"maxHeight":"352"},
            controlStyle:{"maxHeight":"180"},
        };

        this.setSizeOut = -1;
    }
    componentWillMount(){
        this.mounted = true;
        window.onresize = event=>{
            this.setSizeOut && clearTimeout(this.setSizeOut);
            this.setSizeOut = setTimeout(()=>{this.setSize()}, 33);
        }
    }

    componentDidMount(){
        this.mounted && this.setSize();
    }

    componentWillUnmount(){
        this.mounted = false;
        window.onresize = event=>{

        }
    }

    formatIntl = (formatId)=>{
        const {intl} = this.props;
        return intl?intl.formatMessage({id:formatId}):"";
    }

    setSize = ()=>{
        if(!this.mounted){
            return;
        }

        const {IsSearch} = this.state;
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

    requestSearch = ()=>{
        this.setState({IsSearchResult: true}, ()=>{

        })
    }

    onChange = (key, event)=>{
        const { search } = this.state;
        if(key == "search"){
            this.setState({search:this.state.search.update('value', v=>event.target.value)}, ()=>{
            });
        }else if(key == "screenSwitch"){
            this.setState({screenSwitch: Object.assign({}, this.state.screenSwitch, {id:event.target.id})});
        }else{
            const item = this.state.playerList.list[event.target.selectedIndex];
            this.setState({playerList: Object.assign({}, this.state.playerList, {id:item.id, name:item.name})});
        }

    }

    submit = (id)=>{

    }

    closeClick = (event)=>{
        if(event.target.id === "poleInfoClose"){
            this.setState({IsOpenPoleInfo: false, IsOpenPreview: false})
        }else{
            this.setState({IsOpenPreview: false});
        }
    }

    preview = ()=>{
        this.setState({IsOpenPreview: true});
    }

    onToggle = ()=>{
        this.setState({IsOpenPoleControl: !this.state.IsOpenPoleControl});
    }

    backHandler = ()=>{
        this.setState({IsSearch: true});
    }

    itemClick = (pole)=>{
        this.setState({IsSearch: false, IsSearchResult:false, curDevice: pole},()=>{
            this.setSize();
        })
    }

    pageChange = (current, pageSize) => {
        let page = this.state.page.set('current', current);
        this.setState({ page: page }, () => {
            this.requestSearchAssetList();
        });
    }

    searchClick = (e)=>{
        this.requestSearch();
    }

    onkeydown = ()=>{

    }

    transformState = (key, sf)=>{
        if(key == 'wind-direction'){
            // return this.formatIntl('app.'+sf);
            return <span className="glyphicon glyphicon-arrow-up" style={{transform:`rotate(${sf}deg)`}}></span>
        }

        if(key == 'brightness_mode'){
            return this.formatIntl(sf ? 'app.manual' : 'app.environment-brightness-control');
        }

        if(key == 'online'){
            return this.formatIntl(sf ? 'app.online' : 'app.offline');
        }

        if(key == 'charge_state'){
            return this.formatIntl(sf ? 'app.charging' : 'app.charging.fault');
        }
        return this.formatIntl(sf ? 'abnormal':'normal');
    }

    renderState = (parentPro, key, name, IsTransform, unit)=>{
        if(key == "resolution"){
            if(parentPro && parentPro.has("width") && parentPro.has("height")){
                return <div key={key} className="pro"><span>{name?this.formatIntl("app."+name):key}:</span>{parentPro.get("width")}x{parentPro.get("height")}</div>
            }
        }
        if(parentPro && parentPro.has(key)){
            if(key == 'wind-direction'){
                return <div key={key} className="pro"><span>{name ? this.formatIntl("app."+name):key}:</span>{this.transformState(key, parentPro.get(key))}</div>
            }

            if(key == 'o2'){
                return <div key={key} className="pro"><span>{name ? this.formatIntl("app."+name):key}:</span>{(parentPro.get(key))+(unit ? ' %'+unit:'')}</div>
            }
            return <div key={key} className="pro"><span>{name ? this.formatIntl("app."+name):key}:</span>{(IsTransform ? this.transformState(key, parentPro.get(key)): parentPro.get(key))+(unit ? ' '+unit:'')}</div>
        }
    }

    render(){
        const {map, search, page, IsSearch, IsSearchResult, searchList, curDevice, screen, screenSwitch, playerList,
            IsOpenPoleInfo, IsOpenPoleControl, IsOpenPreview, listStyle, infoStyle, controlStyle} = this.state;
        return <Content>
            <MapView mapData={map}></MapView>
            <div className="search-container">
                <div className={"searchText smartLight-map"} onKeyDown={this.onkeydown}>
                    <input type="search" className="form-control" placeholder={search.get('placeholder')} value={search.get("value")} onChange={(event)=>this.onChange('search', event)}/>
                    <span role="mediaPublishMapSearch" className="glyphicon glyphicon-search" onClick={this.searchClick}></span>
                </div>
                <div className={"search-result "+(IsSearch && IsSearchResult?"":"hidden")}>
                    <ul className={"list-group "} style={listStyle}>
                        {
                            searchList.map(pole=>{
                                return <li key={pole.get("id")} className="list-group-item" onClick={()=>this.itemClick(pole)}>
                                    {pole.get("name")}
                                </li>
                            })
                        }
                    </ul>
                    <Page className={'page ' + (page.get('total') == 0 ? 'hidden' : '')} showSizeChanger
                          pageSize={page.get('pageSize')}
                          current={page.get('current')} total={page.get('total')}
                          onChange={this.pageChange} />
                </div>

                <div className={"margin-top margin-bottom search-back "+(IsSearch?"hidden":"")} style={{"marginBottom":(infoStyle.maxHeight>0?15:0)+"px"}}
                     onClick={this.backHandler}>
                    <span className="glyphicon glyphicon-menu-left padding-left padding-right"></span>
                    <span className="name">{this.formatIntl('app.search.list')}</span>
                </div>
                <div ref="poleInfo" id="poleInfo" className={"panel panel-info pole-info "+(IsSearch || infoStyle.maxHeight==0?"hidden":"")}
                     style={{"maxHeight":infoStyle.maxHeight+"px"}}>
                    <div className={"panel-heading "+(infoStyle.maxHeight==0?"hidden":"")} style={{"maxHeight":(infoStyle.maxHeight>40?38:infoStyle.maxHeight)+"px"}}>
                        <h3 className={"panel-title "+(infoStyle.maxHeight<30?"hidden":"")}>{curDevice && curDevice.get("name")}</h3>
                        { /*<button type="button" id="poleInfoClose" className="close" data-dismiss="modal" aria-label="Close" onClick={this.closeClick}><span aria-hidden="true">&times;</span></button>*/}
                    </div>
                    <div className={"panel-body "+(infoStyle.maxHeight<40?"hidden":"")} style={{"maxHeight":(infoStyle.maxHeight>40?infoStyle.maxHeight-40:0)+"px"}}>
                        <div className="row state-info screen">
                            <div className="col-sm-8 prop">
                                {this.renderState(screen, "resolution", "width")}
                                {this.renderState(screen, "online", "online", true)}
                                {this.renderState(screen, "version", "version")}
                                {this.renderState(screen, "brightness_mode", "brightness_mode", true)}
                                {this.renderState(screen, "brightness", "brightness")}
                                {
                                    // <div className="fault-container"><span className="name">{this.formatIntl('app.fault')}:</span><span className={faultList.length>0?"fault":"pass"} onClick={(event)=>{faultList.length>0 && this.faultClick(event)}}></span></div>
                                }
                                {
                                    // faultList.length>0 &&
                                    // <Panel className={"faultPanel panel-primary "+(IsOpenFault?'':'hidden')} style={faultStyle} title={this.formatIntl('app.fault_info')} closeBtn={true}
                                    //        closeClick={this.closeClick}>
                                    //     {
                                    //         faultList.map(key=>{
                                    //             return <div key={key}>{this.formatIntl("app."+key)}</div>
                                    //         })
                                    //     }
                                    // </Panel>
                                }
                            </div>
                            <div className="col-sm-4 img-container">
                                <img src="http://localhost:8080/images/smartLight/screen_test.png"/>
                                <button className="col-sm-3 btn btn-primary" onClick={this.preview}>预览</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"panel panel-info pole-control "+(IsSearch  || controlStyle.maxHeight==0?"hidden":"")} style={{"maxHeight":controlStyle.maxHeight+"px"}}>
                    <div className={"panel-heading "+(controlStyle.maxHeight==0?"hidden":"")}
                         style={{"maxHeight":(controlStyle.maxHeight>40?38:controlStyle.maxHeight)+"px","borderBottom":(controlStyle.maxHeight<=40?0:1)+"px",
                        "paddingBottom":(controlStyle.maxHeight<40?0:10)+"px","paddingTop":(controlStyle.maxHeight<30?0:10)+"px"}}>
                        <h3 className={"panel-title "+(controlStyle.maxHeight<19?"hidden":"")}>{this.formatIntl('app.device.control')}</h3>
                        <span role="pole-control-btn" className={"glyphicon "+ (IsOpenPoleControl?"glyphicon-triangle-bottom ":"glyphicon-triangle-right ")+(controlStyle.maxHeight<27?"hidden":"")} onClick={this.onToggle}></span>
                    </div>
                    <div className={"panel-body "+(!IsOpenPoleControl || controlStyle.maxHeight<=40?"hidden":"")}
                         style={{"maxHeight":(controlStyle.maxHeight>40?controlStyle.maxHeight-40:0)+"px",
                             "paddingBottom":(controlStyle.maxHeight<70?0:15)+"px","paddingTop":(controlStyle.maxHeight<55?0:15)+"px"}}>
                        <div className="row state-control screen">
                            <div className="col-sm-12 form-group switch">
                                <label className="col-sm-4">显示屏开关:</label>
                                {
                                    screenSwitch.list.map(swi=>{
                                        return <span id={swi.id} key={swi.id} role="screenSwitch" className={"col-sm-2 switch-container"} onClick={event=>this.onChange("screenSwitch", event)}>
                                            <input id={swi.id} type="radio" name={swi.id} checked={swi.id == screenSwitch.id?true:false} onChange={()=>{}}/>{swi.value}
                                        </span>
                                    })
                                }

                                <button className="col-sm-3 btn btn-primary padding-left" onClick={event=>this.submit("screenSwitch")}>{this.formatIntl('button.apply')}</button>
                            </div>
                            <div className="col-sm-12 form-group time-table">
                                <label className="col-sm-4">播放列表:</label>
                                <select className="col-sm-4" value={playerList.name} onChange={event=>this.onChange("playerList", event)}>
                                    {
                                        playerList.list.map(player=>{
                                            return <option key={player.id}>{player.name}</option>
                                        })
                                    }
                                </select>
                                <button className="col-sm-3 btn btn-primary" onClick={event=>this.submit("playerList")}>{this.formatIntl('button.apply')}</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div ref="preView" id="preView" className={"panel panel-info preview "+(IsSearch || !IsOpenPreview || infoStyle.maxHeight==0?"hidden":"")}
                     style={{"maxHeight":infoStyle.maxHeight+"px"}}>
                    <div className={"panel-heading "+(infoStyle.maxHeight==0?"hidden":"")} style={{"maxHeight":(infoStyle.maxHeight>40?38:infoStyle.maxHeight)+"px"}}>
                        <h3 className={"panel-title "+(infoStyle.maxHeight<30?"hidden":"")}>屏幕预览</h3>
                        <button id="preViewClose" type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.closeClick}><span aria-hidden="true">&times;</span></button>
                    </div>
                    <div className={"panel-body "+(infoStyle.maxHeight<40?"hidden":"")} style={{"maxHeight":(infoStyle.maxHeight>40?infoStyle.maxHeight-40:0)+"px"}}>
                        <img src="http://localhost:8080/images/smartLight/screen_test.png"/>
                    </div>
                </div>
            </div>
        </Content>
    }
}

export default injectIntl(MediaPublishMap);