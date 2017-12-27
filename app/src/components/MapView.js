/**
 * Created by a on 2017/7/25.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Map from '../util/map'
import {transformDeviceType} from '../util/index'

export default class MapView extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.cur = {}
        this.initMap = this.initMap.bind(this);
        this.renderMap = this.renderMap.bind(this);
    }

    componentWillMount(){
    }

    componentDidUpdate() {
        const {mapData, panLatlng, panCallFun} = this.props;
        this.initMap();
        if (panLatlng) {
            this.state[mapData.id].mapPanTo(panLatlng);
            // panCallFun && panCallFun()
        }
    }

    componentWillUnmount() {
        for (let key in this.state) {
            this.state[key].destroy();
        }
    }

    initMap() {
        const {option, mapData, mapCallFun=null, markerCallFun=null} = this.props;
        let {latlng={lat: null, lng: null}} = mapData
        if (mapData) {
            if (!this.state[mapData.id]) {
                this.state[mapData.id] = new Map();
            }
            this.state[mapData.id].clearMarker();
            this.state[mapData.id].updateMap({
                id: mapData.id,
                latlng: latlng
            }, option, mapCallFun);
            if (mapData.position && mapData.position.length) {
                let key = transformDeviceType(mapData.position[0]["device_type"]);
                this.state[mapData.id].updateMapDevice(mapData.position, {[key]: mapData.data}, markerCallFun)
            }
        }
    }

    renderMap(ref) {
        if (ref) {
            this.initMap();
        }
    }

    render() {
        const {className='', mapData} = this.props;
        return <div className={"map-view "+className} ref={this.renderMap} id={mapData && mapData.id}></div>
    }
}

MapView.propTypes = {
    mapData: PropTypes.shape({
        id: PropTypes.string.isRequired,
        // latlng: PropTypes.shape({
        //     lat: PropTypes.number.isRequired,
        //     lng: PropTypes.number.isRequired,
        // })
    }).isRequired
}