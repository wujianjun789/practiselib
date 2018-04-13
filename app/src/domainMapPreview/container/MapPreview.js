/**
 * Created by a on 2017/7/25.
 */
import React,{Component} from 'react'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';

import '../../../public/styles/domain-mapPreview.less';
import Content from '../../components/Content';
import MapView from '../../components/MapView';

import SearchText from '../../components/SearchText';

import {addNotify, removeAllNotify} from '../../common/actions/notifyPopup'
import {getMapConfig, getDomainConfig} from '../../util/network';
import {getDomainList, getDomainByDomainLevelWithCenter, getDomainListByParentId} from '../../api/domain';
import {getAssetsBaseByDomain,getAssetsByDomainLevelWithCenter} from '../../api/asset';

import {DOMAIN_LEVEL} from '../../common/util/index';
import {DOMAIN_NAME_LENGTH} from '../../common/util/constant';

import {getDomainLevelByMapLevel, getDeviceTypeByModel} from '../../util/index';
import lodash from 'lodash';
export class MapPreview extends Component{
    constructor(props){
        super(props)
        this.state = {
            mapId: "mapPreview",
            domainList: [],

            search:{placeholder:'输入域名称搜索', value:'', curIndex:-1},
            placeholderList: [],

            curDomainList: [],//device or domain
            positionList: [],

            panLatlng: null
        }

        this.map = {
            center:{lng: 121.49971691534425, lat: 31.239658843127756}
        };

        this.mapConfig = null;
        this.domainConfig = null;
        this.domainLevel = DOMAIN_LEVEL+1;
        this.domainCurLevel = 0;

        this.responseTime = -1;
        this.responseTimeout = null;

        this.onChange = this.onChange.bind(this);
        this.updatePlaceholder = this.updatePlaceholder.bind(this);
        this.itemClick = this.itemClick.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.panCallFun = this.panCallFun.bind(this);
        this.initDomainList = this.initDomainList.bind(this);

        this.requestCurDomain = this.requestCurDomain.bind(this);
        this.mapDragend = this.mapDragend.bind(this);
        this.mapZoomend = this.mapZoomend.bind(this);
        this.markerClick = this.markerClick.bind(this);
    }

    componentWillMount(){
        this.mounted = true;
        getMapConfig(data=>{
            if(this.mounted){
                this.mapConfig = data;
                this.map = Object.assign({}, this.map, data, {zoomStep:Math.ceil((data.maxZoom-data.minZoom)/this.domainLevel)});
                this.domainCurLevel = getDomainLevelByMapLevel(this.domainLevel, this.map);
                getDomainConfig(data=>{
                    if(this.mounted){
                        this.domainConfig = data;
                        this.map.zoom = data[0].zoom;
                    }
                })
            }
        });
        getDomainList(data=>{ this.mounted && this.initDomainList(data)})
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    initDomainList(data){
        this.mounted && this.setState({domainList:data});
    }

    updatePlaceholder(){
        const {domainList, search} = this.state;
        let datalist = [];
        for(var key in domainList){
            let item = domainList[key];
            if(!search.value || item.name.indexOf(search.value)>-1){
                datalist.push({id:item.id, value:item.name})
            }
        }
        this.setState({placeholderList:datalist});
    }

    onChange(value){
        const { search } = this.state;

        let newValue = Object.assign({}, search, {value:value});
        this.setState({search:newValue}, ()=>{
            setTimeout(()=>{this.updatePlaceholder()}, 33);
        });
    }

    itemClick(itemIndex){
        const {search} = this.state
        let newValue = Object.assign({}, search, {curIndex:itemIndex});
        this.setState({search:newValue});
    }

    requestCurDomain(){
        this.responseTime = new Date().getTime();
        if(this.domainCurLevel==this.domainLevel){
            // getAssetsByDomainLevelWithCenter(this.domainCurLevel, this.map, null, data=>{
            //     let devPositionList = data.map(item=>{
            //         let gePoint = item.geoPoint ? item.geoPoint : {lat:"", lng:""};
            //         return Object.assign(gePoint, {"device_type":getDeviceTypeByModel(item.extendType), "device_id":item.id});
            //     })
            //     this.mounted && this.setState({curDomainList: data, positionList:devPositionList});
            // })
            this.mounted && this.setState({curDomainList: [], positionList:[]});
            return false;
        }

        getDomainByDomainLevelWithCenter(this.domainCurLevel, this.map, this.responseTime, (data, timestamp)=>{
            let positionList = data.map(item=>{
                let geoPoint = item.geoPoint ? item.geoPoint : {lat:"", lng:""};
                return Object.assign(geoPoint, {"device_type":"DEVICE", "device_id":item.id, IsCircleMarker: true});
            })
            if(this.mounted){
                // console.log('responseTimeout:',this.responseTimeout);
                // this.responseTimeout && clearTimeout(this.responseTimeout);
                // this.responseTimeout = setTimeout(()=>{

                timestamp === this.responseTime && this.setState({curDomainList: data, positionList:positionList},()=>{
                    let deviceLen = [];
                    const locale = this.props.intl;
                    data.map(item=>{
                        const itemLen = item.name.length;
                        getDomainListByParentId(item.id, (parentId,asset)=>{
                        // getAssetsBaseByDomain(item.id, asset=>{
                            deviceLen.push(item.id);
                            let curIndex = lodash.findIndex(this.state.curDomainList, domain=>{
                                return domain.id == item.id
                            })

                            if(curIndex>-1 && curIndex<this.state.curDomainList.length){
                                this.state.curDomainList[curIndex].detail = item.name.slice(0, DOMAIN_NAME_LENGTH-6)+
                                  (itemLen>DOMAIN_NAME_LENGTH-6 ? "...":"")+
                                  ' \n'+asset.length/*+this.props.intl.formatMessage({id:'map.device.tip'})*/;
                            }

                            if (deviceLen.length == data.length){
                                // this.mounted && this.setState({curDomainList: this.state.curDomainList});
                            }
                        })
                    })
                })
            // }, 33);
            }
        })
        
    }

    searchSubmit(){
        const {domainList, search} = this.state;
        for(let i=0;i<domainList.length;i++){
            let item = domainList[i];
            if(!search.value || item.name.indexOf(search.value)>-1){
                this.map.center = item.geoPoint;
                this.mounted && this.setState({panLatlng:item.geoPoint});
                break;
            }
        }

        this.requestCurDomain();
    }

    panCallFun(){
        this.mounted && this.setState({panLatlng:null});
    }

    mapDragend(data){
        this.map = Object.assign({}, this.map, {center:{lng:data.latlng.lng, lat:data.latlng.lat}, distance:data.distance});

        this.requestCurDomain();
    }

    mapZoomend(data){
        this.map = Object.assign({}, this.map, {zoom:data.zoom, center:{lng:data.latlng.lng, lat:data.latlng.lat}, distance:data.distance});
        this.domainCurLevel = getDomainLevelByMapLevel(this.domainLevel, this.map);
        this.requestCurDomain();
    }

    markerClick(data){
        if(this.domainCurLevel < this.domainLevel){
            this.domainCurLevel += 1;
            let nextDomain = lodash.find(this.domainConfig, doma=>{ return doma.id == this.domainCurLevel});
            if(nextDomain){
                this.map = Object.assign({}, this.map, {zoom:nextDomain.zoom, center:{lng:data.latlng.lng, lat:data.latlng.lat}});
            }else{
                this.map = Object.assign({}, this.map, {zoom:this.mapConfig.zoom, center:{lng:data.latlng.lng, lat:data.latlng.lat}});
            }

            this.requestCurDomain();
        }

        // if(this.map.zoom+this.map.zoomStep <= this.map.maxZoom){
        //     this.map = Object.assign({}, this.map, {zoom:data.zoom+this.map.zoomStep, center:{lng:data.latlng.lng, lat:data.latlng.lat}});
        //     this.domainCurLevel = getDomainLevelByMapLevel(this.domainLevel, this.map);
        //     this.requestCurDomain();
        // }
    }

    render(){
        const {mapId, search, placeholderList, curDomainList, positionList, panLatlng} = this.state;
        return <Content className="map-preview">
            <MapView option={{zoom:this.map.zoom}} mapData={{id:mapId, latlng:this.map.center, position:positionList, data:curDomainList}}
                     mapCallFun={{mapDragendHandler:this.mapDragend, mapZoomendHandler:this.mapZoomend, markerClickHandler:this.markerClick}} panLatlng={panLatlng} panCallFun={this.panCallFun}/>
            <SearchText IsTip={true} datalist={placeholderList} placeholder={search.placeholder} value={search.value}
                        onChange={this.onChange} itemClick={this.itemClick} submit={this.searchSubmit}/>
            </Content>
    }
}

function mapStateToProps(state) {
    return {
        intl: state.intl
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            addNotify: addNotify,
            removeAllNotify: removeAllNotify
        }, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectIntl(MapPreview));