import React, { Component } from 'react';
import PanelFooter from '../../components/PanelFooter.js';
import Select from '../../components/Select.js';
import SearchText from '../../components/SearchText.js';
import DeviceList from './list/index.js';


export default class EditPopupComponet extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const props = this.props;
        console.log('EditPopup.props', props)
        const footer = <PanelFooter funcNames={ [null, 'onConfirmed'] } btnTitles={ [null, '完成'] } {...props}/>;
        return (<div id='edit-popup' className='clearfix'>
                  <span>选择设备:</span>
                  <div className='edit_selectdevice-content clearfix'>
                    <div>
                      <Select className='edit_selectdevice-select' onChange={ this.props.onChange } data={ this.props.equipmentSelectList } />
                      <SearchText className='edit_selectdevice-searchtext' placeholder='输入设备名称' />
                      <DeviceList className='edit_selectdevice-ul' operations={ ['添加', '已添加'] } {...props}/>
                    </div>
                    <div className='edit_whole-content clearfix'>
                      <ul className='edit_whole-ul'>
                        <DeviceList className='edit_selectdevice-ul' showIcon={ true } {...props}/>
                      </ul>
                    </div>
                  </div>
                  { footer }
                </div>)
    }
}