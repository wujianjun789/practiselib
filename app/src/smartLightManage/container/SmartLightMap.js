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
            IsSearch: true,
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
            ])
        }

        this.deviceTypes = [
            {id:"pole", className:"icon_pole"},
            {id:"screen", className:"icon_screen"},
            {id:"camera", className:"icon_camera"},
            {id:"lamp", className:"icon_lamp"},
            {id:"charge", className:"icon_charge"}
        ];

        this.renderInfo = this.renderInfo.bind(this);
        this.renderState = this.renderState.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
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
                return <div className="state-info screen">
                    <div className="prop">
                        {this.renderState(props, "width", "width")}
                        {this.renderState(props, "height", "height")}
                        {this.renderState(props, "version", "version")}
                        {this.renderState(props, "brightness_mode", "brightness_mode", true)}
                        {this.renderState(props, "brightness", "brightness")}
                    </div>
                    <div className="img-container"><img src=""/></div>
                </div>
        }
    }

    render(){
        const {deviceId, IsSearch, IsSearchResult, curDevice, curId, searchList} = this.state;
        return (
            <Content>
                <MapView mapData={{id:"smartLightMap"}}/>
                <div className="search-container">
                    <div className="searchText">
                        <input type="search" className="form-control" onChange={()=>{}}/>
                        <span className="glyphicon glyphicon-search" onClick={this.searchSubmit}></span>
                    </div>
                    <ul className={"list-group "+(IsSearchResult?"":"hidden")}>
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

                    <div className="search-back">
                        <span className="glyphicon glyphicon-menu-left padding-left padding-right"></span>
                        <span className="name">{"返回搜索结果"}</span>
                    </div>
                    <div className="panel panel-info pole-info">
                        <div className="panel-heading">
                            <h3 className="panel-title">{curDevice.get("name")}</h3>
                        </div>
                        <div className="panel-body">
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
                    <div className="panel panel-info pole-control">
                        <div className="panel-heading">
                            <h3 className="panel-title">{"设备控制"}</h3>
                        </div>
                        <div className="panel-body">

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