/**
 * Created by a on 2017/7/5.
 */
import React, { Component } from 'react'
import '../../public/styles/sideBarInfo.less';

import MapView from '../components/MapView'
/**
 * 右侧栏带地图伸缩信息
 */
export default class SideBarInfo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            collapse: false,
        }

        this.collpseHandler = this.collpseHandler.bind(this);
    }



    collpseHandler() {
        this.setState({
            collapse: !this.state.collapse
        });

        this.props.collpseHandler && this.props.collpseHandler();
    }


    render() {
        const {collapse} = this.state;
        const {IsHaveMap=true,mapDevice={id: 'example'}, style} = this.props;
        return <div className={ "container-fluid sidebar-info " + (collapse ? "sidebar-collapse" : "") } style={ style }>
                    <svg className="svgOnload">
                        <symbol id="icon_map_position"><path d="M103.123,152.141l31.099-35.651c12.158-11.784,18.903-27.393,18.841-43.601c-0.074-36.12-32.128-65.346-71.594-65.278l0,0
    C42.078,7.292,9.863,36.259,9.516,72.31c-0.157,16.238,6.304,31.945,18.122,44.057l31.478,35.959
    c-17.32,1.486-49.242,6.121-49.242,19.466c0,14.165,37.143,20.569,71.594,20.569s71.594-6.404,71.46-20.569
    C152.927,158.312,120.319,153.466,103.123,152.141z M56.168,71.411c0.074-12.856,11.522-23.223,25.569-23.155
    c13.995,0.068,25.3,10.47,25.3,23.278c0,12.856-11.387,23.278-25.435,23.278h-0.134C67.421,94.745,56.094,84.267,56.168,71.411z
     M81.468,184.724c-41.315,0-62.577-9.115-62.577-12.316c0-3.18,14.316-10.269,47.064-12.297l11.61,13.282
    c0.871,0.94,2.151,1.481,3.499,1.478c1.343-0.014,2.616-0.551,3.499-1.478l11.613-13.304c33.178,2.355,47.87,8.634,47.87,12.319
    C144.046,176.102,122.783,184.724,81.468,184.724z"/></symbol>
                    </svg>
                 <div className="row collapse-container" onClick={ () => this.collpseHandler() }>
                   <span className={ collapse ? "icon_horizontal" : "icon_verital" }></span>
                 </div>
                 { this.props.children }
                {IsHaveMap &&
                 <div className="panel panel-default map-position">
                   <div className="panel-heading">
                     <svg><use xlinkHref={"#icon_map_position"} transform="scale(0.086,0.086)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg>地图位置
                   </div>
                   <div className="map-container panel-body">
                     <MapView option={ { mapZoom: false } } mapData={ mapDevice } />
                   </div>
                 </div>}
               </div>
    }
}

