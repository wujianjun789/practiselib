import React, { Component } from 'react';
import PanelFooter from '../../components/PanelFooter.js';
import Select from '../../components/Select.1.js';
import SearchText from '../../components/SearchText.js';
import DeviceList from './list/index.js';


export default class EditPopupComponet extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const props = this.props;
    const {equipmentSelectList, search} = props;
    const footer = <PanelFooter funcNames={ [null, 'onConfirmed'] } btnTitles={ [null, '完成'] } {...props}/>;
    return (<div id='edit-popup' className='clearfix'>
              <span>选择设备:</span>
              <div className='edit_selectdevice-content clearfix'>
                <div>
                  <Select className='edit_selectdevice-select' onChange={ this.props.onChange } {...equipmentSelectList}/>
                  <SearchText className='edit_selectdevice-searchtext' placeholder={ search.placeholder } onChange={ this.props.searchTextOnChange } value={ this.props.value } submit={ this.props.searchAssets }
                  />
                  <DeviceList className='edit_selectdevice-ul' operations={ ['添加', '已添加'] } data={ this.props.allEquipmentsData } itemClick={ this.props.itemClick } />
                </div>
                <div className='edit_whole-content clearfix'>
                  <ul className='edit_whole-ul'>
                    <DeviceList className='edit_selectdevice-ul' showIcon={ true } data={ this.props.allPoleEquipmentsData } iconClassName='delete' itemClick={ this.props.deleteClick } />
                  </ul>
                </div>
              </div>
              { footer }
            </div>)
  }
}