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
    const {equipmentSelectList} = props;
    //console.log('EditPopup.props', props);
    //equipmentSelectList.value = equipmentSelectList.value.length === 0 ? equipmentSelectList.options[0].value : equipmentSelectList.value;
    console.log('props', equipmentSelectList);
    const footer = <PanelFooter funcNames={ [null, 'onConfirmed'] } btnTitles={ [null, '完成'] } {...props}/>;
    return (<div id='edit-popup' className='clearfix'>
              <span>选择设备:</span>
              <div className='edit_selectdevice-content clearfix'>
                <div>
                  <Select className='edit_selectdevice-select' onChange={ this.props.onChange } {...equipmentSelectList}/>
                  <SearchText className='edit_selectdevice-searchtext' placeholder='输入设备名称' />
                  <DeviceList className='edit_selectdevice-ul' operations={ ['添加', '已添加'] } data={ this.props.allEquipmentsData } />
                </div>
                <div className='edit_whole-content clearfix'>
                  <ul className='edit_whole-ul'>
                    <DeviceList className='edit_selectdevice-ul' showIcon={ true } data={ this.props.allPoleEquipmentsData } {...props}/>
                  </ul>
                </div>
              </div>
              { footer }
            </div>)
  }
}