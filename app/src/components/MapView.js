/**
 * Created by a on 2017/7/25.
 */
import React,{Component} from 'react'

import Map,{updateMap} from '../util/map'
import {transformDeviceType} from '../util/index'

export default class MapView extends Component{
    constructor(props){
        super(props);
        this.state = {}
        this.cur = {}
        this.initMap = this.initMap.bind(this);
        this.renderMap = this.renderMap.bind(this);
    }

    componentDidUpdate(){
        this.initMap();
    }

    componentWillUnmount(){
        const {mapData}  = this.props;
        for(let key in this.state){
            this.state[key].destory();
        }
    }

    initMap(){
        const {option, mapData} = this.props;
        if(mapData){
            this.state[mapData.id] && this.state[mapData.id].destory();
            this.state[mapData.id] = new Map();
            this.state[mapData.id].updateMap({id:mapData.id, latlng:{lng:mapData.position.lng, lat:mapData.position.lat}}, option);
            let key = transformDeviceType(mapData.position["device_type"]);

            this.state[mapData.id].updateMapDevice([mapData.position], {[key]:[mapData.data]})
        }
    }

    renderMap(ref) {
        if (ref) {
            this.initMap();
        }
    }

    render(){
        const {className='', mapData} = this.props;
        return <div className={"map-view "+className} ref={this.renderMap} id={mapData && mapData.id}></div>
    }
}