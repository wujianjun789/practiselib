import React, { Component } from 'react';
import PanelFooter from '../../components/PanelFooter.js';
import Select from '../../components/Select.1.js';
import SearchText from '../../components/SearchText.js';
import DeviceList from './list/index.js';

export default class EditPopupComponet extends Component {
  render() {
    const props = this.props;
    const {equipmentSelectList, allPoleEquipmentsData, allEquipmentsData, search, onChange, itemClick, deleteClick, searchTextOnChange, value, searchAssets} = props;
    const footer = <PanelFooter funcNames={ [null, 'onConfirmed'] } btnTitles={ [null, '完成'] } {...props}/>;
    return (<div id='edit-popup' className='clearfix'>
              <span>选择设备:</span>
              <div className='edit_selectdevice-content clearfix'>
                <div>
                  <Select className='edit_selectdevice-select' onChange={ onChange } {...equipmentSelectList}/>
                  { /* We use {...props} to replace itemClick={itemClick}.*/ }
                  <SearchText className='edit_selectdevice-searchtext' placeholder={ search.placeholder } onChange={ searchTextOnChange } value={ value } submit={ searchAssets }
                  />
                  <DeviceList className='edit_selectdevice-ul' operations={ ['添加', '已添加'] } data={ allEquipmentsData } {...props}/>
                </div>
                <div className='edit_whole-content clearfix'>
                  <ul className='edit_whole-ul'>
                    <DeviceList className='edit_selectdevice-ul' showIcon={ true } iconClassName='delete' data={ allPoleEquipmentsData } itemClick={ deleteClick } />
                  </ul>
                </div>
              </div>
              { footer }
            </div>)
  }
}