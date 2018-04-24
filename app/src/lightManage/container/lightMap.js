/**
 * Created by a on 2017/7/25.
 */
import React,{Component} from 'react'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';

import '../../../public/styles/lightManage-map.less';
import Content from '../../components/Content';
import MapView from '../../components/MapView';

import ModelSearch from '../component/ModelSearch';

import {addNotify, removeAllNotify} from '../../common/actions/notifyPopup'
import {getMapConfig, getDomainConfig} from '../../util/network';
import {getDomainList, getDomainByDomainLevelWithCenter, getDomainListByParentId} from '../../api/domain';
import {getAssetsByDomainLevelWithCenter} 	from '../../api/asset';

import {DOMAIN_LEVEL} from '../../common/util/index';
import {DOMAIN_NAME_LENGTH} from '../../common/util/constant';

import {getDomainLevelByMapLevel} from '../../util/index';
import Immutable from 'immutable'
import {throttle} from '../../util/algorithm';
import { Spin } from 'antd';
import lodash from 'lodash';
export class MapPreview extends Component{
    constructor(props){
        super(props)
        this.state = {
            mapId: "mapPreview",
            domainList: [],
            search:{placeholder:this.formatIntl('domain.input.placeholder'), value:'', curIndex:-1},
            placeholderList: [],
            curDomainList: [],//device or domain
            positionList: [],
            panLatlng: null,
            loading: true
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
        this.onChangeTimeout = null;

        this.throttle = null;
        this.lastTime = 0;
        
        this.andNot = 0;
        this.domainList = [];

        this.formatIntl = this.formatIntl.bind(this);
        this.onChange = this.onChange.bind(this);
        this.updatePlaceholder = this.updatePlaceholder.bind(this);
        this.itemClick = this.itemClick.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.panCallFun = this.panCallFun.bind(this);
        this.initDomainList = this.initDomainList.bind(this);

        this.requestCurDomain = this.requestCurDomain.bind(this);
        this.mapMoveend = this.mapMoveend.bind(this);
//      this.mapZoomend = this.mapZoomend.bind(this);
        this.markerClick = this.markerClick.bind(this);
        this.handleInfo = this.handleInfo.bind(this);
        
        //this.setSize = this.setSize.bind(this);
    }

    componentWillMount(){
    	console.log("componentWillMount")
        this.mounted = true;
        this.throttle = throttle(this.updatePlaceholder, 33, 1000);
        getMapConfig(data=>{
            if(this.mounted){
                this.mapConfig = data;
                this.map = Object.assign({}, this.map, data, {zoomStep:DOMAIN_LEVEL});
                this.domainCurLevel = getDomainLevelByMapLevel(this.domainLevel, this.map);
                getDomainConfig(data=>{
                    if(this.mounted){
                        this.domainConfig = data;
                        //this.map.zoom = data[0].zoom;
                        getDomainList(data=>{ this.mounted && this.initDomainList(data)});
                    }
                })
            }
        });
        
    }
    
    componentWillReceiveProps(nextProps) {
    	console.log("componentWillReceiveProps")
    	this.mounted = true;
        this.throttle = throttle(this.updatePlaceholder, 33, 1000);
        getMapConfig(data=>{
            if(this.mounted){
                this.mapConfig = data;
                this.map = Object.assign({}, this.map, data, {zoomStep:DOMAIN_LEVEL});
                this.domainCurLevel = getDomainLevelByMapLevel(this.domainLevel, this.map);
                getDomainConfig(data=>{
                    if(this.mounted){
                        this.domainConfig = data;
                        //this.map.zoom = data[0].zoom;
                        getDomainList(data=>{ this.mounted && this.initDomainList(data)});
                    }
                })
            }
        });
        
    }

    shouldComponentUpdate(){
        return true;
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    formatIntl(formatId){
        const {intl} = this.props;
        return intl?intl.formatMessage({id:formatId}):null;
        // return formatId;
    }
    
//  setSize(){
//      if(!this.mounted){return;}
//      const {IsSearch, curId} = this.state;
//      let height = window.innerHeight;
//      if(IsSearch){
//          this.listStyle = {"maxHeight":(height<145?0:height-145)+"px"};
//      }else{
//          let defaultHeight = 230;
//          if(this.refs.poleInfo){
//              defaultHeight += findDOMNode(this.refs.poleInfo).offsetHeight;
//          }
//          this.infoStyle = {"maxHeight":(height<230?0:height-230)};
//          this.controlStyle = {"maxHeight":(height<defaultHeight?0:height-defaultHeight)};
//      }
//  }
    
    handleInfo(curList,positionList,item,tableIndex,IsSearchResult){
            if(tableIndex===0&&IsSearchResult){
                    //如果是根据设备名称搜索
                    if(this.domainCurLevel===5){
                        //如果域级别是设备级别，则移动到指定坐标
                        this.map = Object.assign({}, this.map, {center:{lng:curList[0].geoPoint.lng, lat:curList[0].geoPoint.lat}});
                        //this.setSize();
                    }else{
                        //如果域级别不是是设备级别，则地图跳转到设备级别并移动到指定坐标
                        this.map = Object.assign({}, this.map, {zoom:this.domainConfig[this.map.zoomStep-1].zoomRange[1]+1,center:{lng:curList[0].geoPoint.lng, lat:curList[0].geoPoint.lat}});
                    }
                    console.log("11111")
                    this.requestCurDomain(item);
                    
            }else if(tableIndex===1&&IsSearchResult){
                    //如果是根据域名称搜索
                    if(curList[0].level===this.domainCurLevel){
                        //如果域级别与搜索域级别相同，则移动到指定坐标
                        this.map = Object.assign({}, this.map, {center:{lng:curList[0].geoPoint.lng, lat:curList[0].geoPoint.lat}});
                    }else{
                        //如果域级别与搜索域级别不相同，则计算出地图级别并跳转到此级别并移动到指定坐标
                        let zoom = this.domainConfig[curList[0].level-1].zoomRange[0];
                        this.map = Object.assign({}, this.map, {zoom:zoom,center:{lng:curList[0].geoPoint.lng, lat:curList[0].geoPoint.lat}});
                    }
                    console.log("22222")
                    this.requestCurDomain(item);
            }else{
                    //如果是点击地图图标
                    if(this.domainCurLevel===this.domainLevel){
                        //如果地图级别是设备级别，则移动到指定坐标并显示状态信息
                        this.map = Object.assign({}, this.map, {center:{lng:curList[0].geoPoint.lng, lat:curList[0].geoPoint.lat}});
                    }else if(this.domainCurLevel<this.domainLevel){
                        //如果地图级别是域级别，则向下一个地图级别并显示信息
                        let zoom = 0;
                        if(this.domainCurLevel>this.map.zoomStep){
			            	zoom=this.map.zoom;
			            }else if(this.domainCurLevel==this.map.zoomStep){
			            	zoom=this.domainConfig[this.domainCurLevel-1].zoomRange[1]+1;
			            }else{
			            	zoom=this.domainConfig[this.domainCurLevel].zoomRange[0];
			            }
                        this.map = Object.assign({}, this.map, {zoom:zoom,center:{lng:curList[0].geoPoint.lng, lat:curList[0].geoPoint.lat}});
                    }else{
                    	
                    }
                    console.log("33333")
                    this.requestCurDomain(item);
           }
            
            
    }

    initDomainList(data){
        if(this.mounted){
        	setTimeout(()=>{this.setState({domainList:data,loading:false})},1500);
        }
    }

    updatePlaceholder(){
        const {search,domainList} = this.state;
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
            this.throttle();
        });
    }

    itemClick(itemIndex){
        const {search} = this.state
        let newValue = Object.assign({}, search, {curIndex:itemIndex});
        this.setState({search:newValue});
    }

    requestCurDomain(item){
//  	this.setState({curDomainList:[], positionList:[]},()=>{
    		this.domainCurLevel = getDomainLevelByMapLevel(this.domainLevel, this.map);
	        this.responseTime = new Date().getTime();
	        if(this.domainCurLevel==this.domainLevel){
	            getAssetsByDomainLevelWithCenter(this.domainCurLevel, this.map, "ssslc", this.responseTime, data=>{
	                let devPositionList = data.map(item=>{
	                   let gePoint = item.geoPoint ? item.geoPoint : {lat:"", lng:""};
	                   //return Object.assign(gePoint, {"device_type":getDeviceTypeByModel(item.extendType), "device_id":item.id});
	                   return Object.assign(gePoint, {"device_type":"DEVICE", "device_id":item.id});
	                })
	                this.mounted && this.setState({curDomainList:data, positionList:devPositionList, searchList:Immutable.fromJS([item])});
	            })
					//this.mounted && this.setState({curDomainList:[], positionList:[]});
				return false;	
	        }
	
	        getDomainByDomainLevelWithCenter(this.domainCurLevel, this.map, this.responseTime, (data, timestamp)=>{
	            let positionList = data.map(item=>{
	                let geoPoint = item.geoPoint ? item.geoPoint : {lat:"", lng:""};
	                return Object.assign(geoPoint, {"device_type":"DEVICE", "device_id":item.id, IsCircleMarker: true});
	            })
	            if(this.mounted){
	                //console.log('responseTimeout:',this.responseTimeout);
	                //this.responseTimeout && clearTimeout(this.responseTimeout);
	                //this.responseTimeout = setTimeout(()=>{
	                timestamp === this.responseTime && this.setState({curDomainList: data, positionList:positionList, searchList:Immutable.fromJS([item])},()=>{
	                    let deviceLen = [];
	                    const locale = this.props.intl;
	                    data.map(item=>{
	                        const itemLen = item.name.length;
	                        getDomainListByParentId(item.id, (parentId,asset)=>{
	                        //getAssetsBaseByDomain(item.id, asset=>{
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
	                                //this.mounted && this.setState({curDomainList: this.state.curDomainList});
	                            }
	                        })
	                    })
	                })
	            	//}, 33);
	            }
	        })
//      });
    }

    searchSubmit(){
        console.log('searchSubmit:');
        const {search,domainList} = this.state;
        for(let i=0;i<domainList.length;i++){
            let item = domainList[i];
            if(!search.value || item.name.indexOf(search.value)>-1){
                this.map.center = item.geoPoint;
                const domainConfig = lodash.find(this.domainConfig, domain=>{ return domain.id === item.level});
                if(domainConfig){
                    this.map.zoom = domainConfig.zoom;
                    this.domainCurLevel = item.level;
                }
                this.mounted && this.setState({panLatlng:item.geoPoint});
                break;
            }
        }
        this.requestCurDomain();
    }

    panCallFun(){
        this.mounted && this.setState({panLatlng:null});
    }
    
//  mapDragend(data){
//
//  }

    mapMoveend(data){
    	
    	if(this.andNot>=3){
    		if(this.map.center.lat==data.latlng.lat&&this.map.center.lng==data.latlng.lng&&this.map.zoom==data.zoom){
    			//console.log("||||||||||||||||||||||")
    		}else{
    			console.log("－－－－－－－－－－－－")
    			this.map = Object.assign({}, this.map, {zoom:data.zoom, center:{lng:data.latlng.lng,lat:data.latlng.lat}, distance:data.distance});
				this.requestCurDomain();
    		}
    	}else{
    		this.andNot=this.andNot+1;
    		return;
    	}

    }

//  mapZoomend(data){
//
//  }

    markerClick(data){
    	
        if(this.domainCurLevel < this.domainLevel){
            this.domainCurLevel += 1;
            let nextDomain = lodash.find(this.domainConfig, data=>{ return data.id == this.domainCurLevel });
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
        			<Spin className="ant-spin-container-lightMap" size="large" tip="正在加载地图数据..." spinning={this.state.loading}></Spin>
		            <MapView option = {{ zoom:this.map.zoom }} mapData = {{ id:mapId, latlng:this.map.center, position:positionList, data:curDomainList }}
		                     mapCallFun={{ mapMoveendHandler:this.mapMoveend, markerClickHandler:this.markerClick }} panLatlng={panLatlng} panCallFun={this.panCallFun}/>
		            <ModelSearch handleInfo={this.handleInfo} />
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