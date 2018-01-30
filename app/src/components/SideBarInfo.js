/**
 * Created by a on 2017/7/5.
 */
import React, { Component } from 'react';
import '../../public/styles/sideBarInfo.less';

import MapView from '../components/MapView';
import {FormattedMessage} from 'react-intl';

/**
 * 右侧栏带地图伸缩信息
 */
export default class SideBarInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapse: false,
      mapCollapse:false,
    };

    this.collapseHandler = this.collapseHandler.bind(this);
  }



  collapseHandler(id) {
    this.setState({
      [id]: !this.state[id],
    });

    id == 'collapse' && this.props.collapseHandler && this.props.collapseHandler(id);
  }


  render() {
    const {collapse, mapCollapse} = this.state;
    const {IsHaveMap = true, mapDevice = {id: 'example'}, style, className} = this.props;
    return <div className={ 'container-fluid sidebar-info ' + (collapse ? 'sidebar-collapse ' : '') + className} style={ style }>
      <div className="row collapse-container" role="presentation" onClick={ () => this.collapseHandler('collapse') }>
        <span className={ collapse ? 'icon_horizontal' : 'icon_vertical' }></span>
      </div>
      { this.props.children }
      {IsHaveMap &&
                 <div className="panel panel-default map-position">
                   <div className="panel-heading"  role="presentation" 
                     onClick={() => { !collapse && this.collapseHandler('mapCollapse'); }}>
                     <span className="icon_map"></span><FormattedMessage id="map.location"/>
                     <span className="icon icon_collapse pull-right"></span>              
                   </div>
                   <div className={'map-container panel-body ' + (mapCollapse ? 'collapsed' : '')}>
                     <MapView option={ { mapZoom: false } } mapData={ mapDevice } />
                   </div>
                 </div>}
    </div>;
  }
}

