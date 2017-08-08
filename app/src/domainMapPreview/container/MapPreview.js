/**
 * Created by a on 2017/7/25.
 */
import React,{Component} from 'react'

import '../../../public/styles/domain-mapPreview.less';
import Content from '../../components/Content'
import MapView from '../../components/MapView'

import SearchText from '../../components/SearchText'

import {getDomainList} from '../../api/domain'

export default class MapPreview extends Component{
    constructor(props){
        super(props)
        this.state = {
            mapId:"mapPreview",
            domainList:[{id:1, name:'domain1', "device_type": 'DEVICE', geoPoint:{lat:31.239658843127756, lng:121.49971691534425}},
                {id:2, name:'domain2', "device_type": 'DEVICE', geoPoint:{lat:31.242658843127756, lng:121.49972691534425}}],
            search:{placeholder:'输入域名称搜索', value:'', curIndex:0},

            curDomain: 0,
            panLatlng:null
        }

        this.onChange = this.onChange.bind(this);
        this.itemClick = this.itemClick.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.panCallFun = this.panCallFun.bind(this);
        this.initDomainList = this.initDomainList.bind(this);
    }

    componentWillMount(){
        this.mounted = true;
        // getDomainList(data=>{ this.mounted && this.initDomainList(data)})
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    initDomainList(data){
        this.setState({domainList:data});
    }

    onChange(value){
        const { search } = this.state;

        let newValue = Object.assign({}, search, {value:value});
        this.setState({search:newValue});
    }

    itemClick(itemIndex){
        const {search} = this.state
        let newValue = Object.assign({}, search, {curIndex:itemIndex});
        this.setState({search:newValue});
    }

    searchSubmit(){
        const {domainList, search} = this.state;
        for(var key in domainList){
            let item = domainList[key];
            if(!search.value || item.name.indexOf(search.value)>-1){
                this.setState({panLatlng:item.geoPoint});
                break;
            }
        }
    }

    panCallFun(){
        console.log('callFun');
        this.setState({panLatlng:null});
    }

    render(){
        const {mapId, domainList, search, curDomain, panLatlng} = this.state;
        let positionList = domainList.map(item=>{
            let geoPoint = item.geoPoint ? item.geoPoint : {lat:"", lng:""};
            return Object.assign(geoPoint, {"device_type":"DEVICE"}, {"device_id":item.id});
        })

        let datalist = [];
        for(var key in domainList){
            let item = domainList[key];
            if(!search.value || item.name.indexOf(search.value)>-1){
                datalist.push({id:item.id, value:item.name})
            }
        }

        let domain = domainList && domainList.length  ? domainList[curDomain]:null;
        let latlng = domain && domain.geoPoint ? domain.geoPoint : null;
        return <Content className="map-preview">
            <MapView mapData={{id:mapId, latlng:latlng, position:positionList, data:domainList}}
                     panLatlng={panLatlng} panCallFun={this.panCallFun}/>
            <SearchText IsTip={true} datalist={datalist} placeholder={search.placeholder} value={search.value}
                        onChange={this.onChange} itemClick={this.itemClick} submit={this.searchSubmit}/>
            </Content>
    }
}