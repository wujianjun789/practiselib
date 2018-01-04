/**
 * Created by a on 2017/7/25.
 */
import React,{Component} from 'react'

import '../../../public/styles/domain-mapPreview.less';
import Content from '../../components/Content';
import MapView from '../../components/MapView';

import SearchText from '../../components/SearchText';

import {getMapConfig} from '../../util/network';
import {getDomainList, getDomainByDomainLevelWithCenter} from '../../api/domain';
import {getAssetsBaseByDomain} from '../../api/asset';

import {getDomainLevelByMapLevel, IsMapCircleMarker} from '../../util/index';
import lodash from 'lodash';
export default class MapPreview extends Component{
    constructor(props){
        super(props)
        this.state = {
            mapId: "mapPreview",
            domainList: [],

            search:{placeholder:'输入域名称搜索', value:'', curIndex:-1},
            placeholderList: [],

            curDomainList: [],
            positionList: [],

            panLatlng: null
        }

        this.map = {
            center:{lng: 121.49971691534425, lat: 31.239658843127756}
        };
        this.domainLevel = 5;
        this.domainCurLevel = 0;

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
                this.map = Object.assign({}, this.map, data, {zoomStep:Math.ceil((data.maxZoom-data.minZoom)/this.domainLevel)});
                this.map.zoom = 15
                this.domainCurLevel = getDomainLevelByMapLevel(this.domainLevel, this.map);
            }
        })

        getDomainList(data=>{ this.mounted && this.initDomainList(data)})
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    initDomainList(data){
        this.setState({domainList:data});
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
            this.updatePlaceholder();
        });
    }

    itemClick(itemIndex){
        const {search} = this.state
        let newValue = Object.assign({}, search, {curIndex:itemIndex});
        this.setState({search:newValue});
    }

    requestCurDomain(){
        getDomainByDomainLevelWithCenter(this.domainCurLevel, this.map, (data)=>{
            let positionList = data.map(item=>{
                let geoPoint = item.geoPoint ? item.geoPoint : {lat:"", lng:""};
                return Object.assign(geoPoint, {"device_type":"DEVICE", "device_id":item.id, IsCircleMarker:IsMapCircleMarker(this.domainLevel, this.map)});
            })

            this.setState({curDomainList: data, positionList:positionList},()=>{
                let deviceLen = [];
                data.map(item=>{
                    getAssetsBaseByDomain(item.id, asset=>{
                        deviceLen.push(item.id);
                        let curIndex = lodash.findIndex(this.state.curDomainList, domain=>{
                            return domain.id == item.id
                        })

                        if(curIndex>-1 && curIndex<this.state.curDomainList.length){
                            this.state.curDomainList[curIndex].detail = item.name+' \n'+asset.length+'件设备';
                        }

                        if (deviceLen.length == data.length){
                            this.setState({curDomainList: this.state.curDomainList});
                        }
                    })
                })

            });
        })
    }

    searchSubmit(){
        const {domainList, search} = this.state;
        for(let i=0;i<domainList.length;i++){
            let item = domainList[i];
            if(!search.value || item.name.indexOf(search.value)>-1){
                this.map.center = item.geoPoint;
                this.setState({panLatlng:item.geoPoint});
                break;
            }
        }

        this.requestCurDomain();
    }

    panCallFun(){
        this.setState({panLatlng:null});
    }

    mapDragend(data){
        this.map = Object.assign({}, this.map, {center:{lng:data.latlng.lng, lat:data.latlng.lat}, distance:data.distance});

        this.requestCurDomain();
    }

    mapZoomend(data){
        this.map = Object.assign({}, this.map, {zoom:data.zoom, center:{lng:data.latlng.lng, lat:data.latlng.lat}, distance:data.distance});
        this.requestCurDomain();
    }

    markerClick(data){
        if(this.map.zoom+this.map.zoomStep <= this.map.maxZoom){
            this.map = Object.assign({}, this.map, {zoom:this.map.zoom+this.map.zoomStep, center:{lng:data.latlng.lng, lat:data.latlng.lat}});

            this.requestCurDomain();
        }
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