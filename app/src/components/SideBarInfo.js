/**
 * Created by a on 2017/7/5.
 */
import React, {Component} from 'react'
import '../../public/styles/sideBarInfo.less';

import MapView from '../components/MapView'
import {updateMap, updateMapDevice, mapPanTo, destory} from '../util/map'
import {transformDeviceType} from '../util/index'
/**
 * 右侧栏带地图伸缩信息
 */
export default class SideBarInfo extends Component{
    constructor(props){
        super(props)

        this.state = {
            collapse:false,
        }

        this.latlng = {};

        this.initMap = this.initMap.bind(this);
        this.renderMap = this.renderMap.bind(this);
        this.collpseHandler = this.collpseHandler.bind(this);
    }

    componentWillMount(){

    }

    componentDidUpdate(){
        // const {mapDevice} = this.props;
        // let key = transformDeviceType(mapDevice.position["device_type"]);
        // updateMapDevice([mapDevice.position], {[key]:[mapDevice.data]})
        // mapPanTo({lng:mapDevice.position.x, lat:mapDevice.position.y});
        // destory();
        this.initMap();
    }

    componentWillUnmount(){
        destory();
    }

    collpseHandler(){
        this.setState({collapse:!this.state.collapse});

        this.props.collpseHandler && this.props.collpseHandler();
    }

    initMap(){
        const {mapDevice} = this.props;
        if(mapDevice){
            updateMap({latlng:{lng:mapDevice.position.x, lat:mapDevice.position.y}});
            let key = transformDeviceType(mapDevice.position["device_type"]);

            updateMapDevice([mapDevice.position], {[key]:[mapDevice.data]})
        }
    }

    renderMap(ref) {
        if (ref) {
            this.initMap();
        }
    }

    render(){
        const {collapse} = this.state;

        return <div className={"container-fluid sidebar-info "+(collapse ? "sidebar-collapse":"")}>
                <div className="row collapse-container" onClick={()=>this.collpseHandler()}>
                    <span className={collapse ? "icon_horizontal":"icon_verital"}></span>
                </div>
                {
                    this.props.children
                }
                <div className="panel panel-default map-position">
                    <div className="panel-heading">
                        <span className="icon_map_position"></span>地图位置
                    </div>
                    <div className="map-container panel-body">
                        <MapView  mapData={this.props.mapDevice} />
                    </div>
                </div>
        </div>
    }
}