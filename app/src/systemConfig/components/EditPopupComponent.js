import React, { Component } from 'react';
import PanelFooter from '../../components/PanelFooter.js';
import Select from '../../components/Select.1.js';
import SearchText from '../../components/SearchText.js';
import DeviceList from './list/index.js';

export default class EditPopupComponet extends Component {

  

  render() {
    const props = this.props;
    console.log(props)
    const {equipmentSelectList, allPoleEquipmentsData, allEquipmentsData, search, onChange, itemClick, deleteClick, searchTextOnChange, value, searchAssets} = props;
    const footer = <PanelFooter funcNames={ [null, 'onConfirmed'] } btnTitles={ [null, '完成'] } {...props}/>;
    return (<div id='edit-popup' className='clearfix'>
              <span className='equipmentName'>选择设备:</span>
              <div className='edit_selectdevice-content clearfix'>
                <div className='h100p'>
                  <Select className='edit_selectdevice-select' onChange={ onChange } {...equipmentSelectList}/>
                  { /* We use {...props} to replace itemClick={itemClick}.*/ }
                  <SearchText className='edit_selectdevice-searchtext' placeholder='输入设备名称' onChange={ searchTextOnChange } value={ value } submit={ searchAssets } />
                  <div className="edit_selectdevice-main pRelative"><DeviceList idName='selectdevice' className='edit_selectdevice-ul' operations={ ['添加', '已添加'] } data={ allEquipmentsData } {...props}/></div>
                </div>
                <div className='edit_whole-content h100p clearfix'>
                  <ul className='edit_whole-ul pRelative'>
                    <DeviceList idName='whole' className='edit_selectdevice-ul' showIcon={ true } iconClassName='delete' data={ allPoleEquipmentsData } itemClick={ deleteClick } />
                  </ul>
                </div>
              </div>
              { footer }
            </div>)
  }
}