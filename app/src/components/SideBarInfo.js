/**
 * Created by a on 2017/7/5.
 */
import React, {Component} from 'react'
import '../../public/styles/sideBarInfo.less';

import Pie from './SensorParamsPie'
import {updateMap, updateMapDevice, destory} from '../util/map'
export default class SideBarInfo extends Component{
    constructor(props){
        super(props)

        this.state = {
            collapse:false,
        }

        this.latlng = {};

        this.renderMap = this.renderMap.bind(this);
        this.collpseHandler = this.collpseHandler.bind(this);
    }

    componentWillMount(){

    }

    componentWillUnmount(){
        destory();
    }

    collpseHandler(){
        this.setState({collapse:!this.state.collapse});

        this.props.collpseHandler && this.props.collpseHandler();
    }

    renderMap(ref) {
        const {mapDevice} = this.props;
        if (ref) {
            updateMap({latlng:this.latlng});
            let key = 'lamp';
            switch(mapDevice.position["device_type"]){
                case "DEVICE":
                    key = 'lamp';
                    break;
                case "CONTROLLER":
                    key = 'controller';
                    break;
                case "ISTREETLIGHT":
                    key = 'intelligent';
                    break;
                case "CHARGER":
                    key = 'charger';
                    break;
            }

            updateMapDevice([mapDevice.position], {[key]:[mapDevice.data]})
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