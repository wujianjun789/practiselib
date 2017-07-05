/**
 * Created by a on 2017/7/5.
 */
import React, {Component} from 'react'
import '../../public/styles/sideBarInfo.less';

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

    collpseHandler(){
        this.setState({collapse:!this.state.collapse});

        this.props.collpseHandler && this.props.collpseHandler();
    }

    renderMap(ref) {
        if (ref) {
            updateMap({latlng:this.latlng});
            // if (this.props.data.size > 0) {
                updateMapDevice([{"device_id":1, "device_type":'DEVICE', x:121.49971691534425, y:31.239658843127756}], {lamp:[{id:1, name:'example'}]})
            // }
        }
    }

    render(){
        const {collapse} = this.state
        return <div className={"container-fluid sidebar-info "+(collapse ? "sidebar-collapse":"")}>
                <div className="row collapse-container" onClick={()=>this.collpseHandler()}>
                    <span className={collapse ? "icon_horizontal":"icon_verital"}></span>
                </div>
                <div className="panel panel-default device-statics-info">
                    <div className="panel-heading">
                        <span className="icon_statistics"></span>设备统计信息
                    </div>
                    <div className="panel-body view">
                        Panel content
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