/**
 * Created by a on 2017/7/25.
 */
import React,{Component} from 'react'

import {updateMap, updateMapDevice, destory} from '../util/map'
import {transformDeviceType} from '../util/index'

export default class MapView extends Component{
    constructor(props){
        super(props);

        this.initMap = this.initMap.bind(this);
        this.renderMap = this.renderMap.bind(this);
    }

    componentDidUpdate(){
        this.initMap();
    }

    componentWillUnmount(){
        destory();
    }

    initMap(){
        const {mapData} = this.props;
        if(mapData){
            updateMap({latlng:{lng:mapData.position.x, lat:mapData.position.y}});
            let key = transformDeviceType(mapData.position["device_type"]);

            updateMapDevice([mapData.position], {[key]:[mapData.data]})
        }
    }

    renderMap(ref) {
        if (ref) {
            this.initMap();
        }
    }

    render(){
        const {className='', mapData} = this.props;
        return <div className={"map-view "+className} ref={this.renderMap} id="map"></div>
    }
}