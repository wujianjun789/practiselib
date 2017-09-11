import React, { Component } from 'react';
import PanelFooter from '../../../../components/PanelFooter.js';
import Select from '../../../../components/Select.1.js';
import SearchText from '../../../../components/SearchText.js';
import DeviceList from './list/index.js';


export default class SecondStepComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const props = this.props;
    const footer = <PanelFooter funcNames={ [null, 'onConfirmed'] } btnTitles={ [null, '完成'] } {...props}/>;
    const data = [{
      name: '摄像头1',
      added: true
    }, {
      name: '摄像头2',
      added: true
    }, {
      name: '摄像头3',
      added: false
    }];
    return (<div id='secstep' className='clearfix'>
              <span>选择设备:</span>
              <div className='secstep_selectdevice-content clearfix'>
                <div>
                  <Select className='secstep_selectdevice-select' />
                  <SearchText className='secstep_selectdevice-searchtext' placeholder='输入设备名称' />
                  <DeviceList className='secstep_selectdevice-ul' data={ data } operations={ ['添加', '已添加'] } />
                </div>
                <div className='secstep_whole-content clearfix'>
                  <ul className='secstep_whole-ul'>
                  </ul>
                </div>
              </div>
              { footer }
            </div>)
  }
}