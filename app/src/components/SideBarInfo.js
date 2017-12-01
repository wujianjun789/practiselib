/**
 * Created by a on 2017/7/5.
 */
import React, { Component } from 'react'
import '../../public/styles/sideBarInfo.less';

import MapView from '../components/MapView'
import {FormattedMessage} from 'react-intl';

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
                 <div className="row collapse-container" onClick={ () => this.collpseHandler() }>
                   <span className={ collapse ? "icon_horizontal" : "icon_verital" }></span>
                 </div>
                 { this.props.children }
                {IsHaveMap &&
                 <div className="panel panel-default map-position">
                   <div className="panel-heading">
                     <span className="icon_map"></span><FormattedMessage id='map.location'/>
                   </div>
                   <div className="map-container panel-body">
                     <MapView option={ { mapZoom: false } } mapData={ mapDevice } />
                   </div>
                 </div>}
               </div>
    }
}

