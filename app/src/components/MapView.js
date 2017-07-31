/**
 * Created by a on 2017/7/25.
 */
import React,{Component} from 'react';
import PropTypes from 'prop-types';

import Map from '../util/map'
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
        const {option, mapData, mapCallFun=null, markerCallFun=null} = this.props;

        if(mapData){
            // this.state[mapData.id] && this.state[mapData.id].destory();
            if(!this.state[mapData.id]){
                this.state[mapData.id] = new Map();
            }

            this.state[mapData.id].updateMap({id:mapData.id, latlng:{lng:mapData.position.lng, lat:mapData.position.lat}}, option, mapCallFun);
            let key = transformDeviceType(mapData.position["device_type"]);

            this.state[mapData.id].updateMapDevice([mapData.position], {[key]:[mapData.data]}, markerCallFun)
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

MapView.propTypes = {
    mapData: PropTypes.shape({
        id: PropTypes.string.isRequired
    }).isRequired
}