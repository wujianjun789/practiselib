/**
 * Created by a on 2017/7/5.
 */
import React, {Component} from 'react'
import '../../public/styles/sideBarInfo.less';

import Pie from './SensorParamsPie'
import {updateMap, updateMapDevice, mapPanTo, destory} from '../util/map'
import {transformDeviceType} from '../util/index'
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
        console.log('update update');
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
            console.log('update map update map');
            this.initMap();
        }
    }

    render(){
        const {collapse} = this.state;
        let {deviceInfo={total:0, normal:0}} = this.props;
        const {total, normal} = deviceInfo;
        let width=145,height=145;
        return <div className={"container-fluid sidebar-info "+(collapse ? "sidebar-collapse":"")}>
                <div className="row collapse-container" onClick={()=>this.collpseHandler()}>
                    <span className={collapse ? "icon_horizontal":"icon_verital"}></span>
                </div>
                <div className="panel panel-default device-statics-info">
                    <div className="panel-heading">
                        <span className="icon_statistics"></span>设备统计信息
                    </div>
                    <div className="panel-body view">
                        <div className="circle1">
                            <Pie data={{type:"NOISE",val:total}} width={width} height={height} color="#E6BC00" className="noise" range={[0, total]}></Pie>
                        </div>
                        <div className="circle2">
                            <Pie data={{type:"TEMPS", val:normal, unit:'%'}} width={width} height={height} color="#E6BC00" className="temps" range={[0, total]}></Pie>
                        </div>
                    </div>
                </div>
                <div className="panel panel-default map-position">
                    <div className="panel-heading">
                        <span className="icon_map_position"></span>地图位置
                    </div>
                    <div ref={this.renderMap} id="map" className="panel-body map"></div>
                </div>
        </div>
    }
}