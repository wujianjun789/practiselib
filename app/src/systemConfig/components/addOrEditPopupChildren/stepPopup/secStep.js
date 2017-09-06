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
    const footer = <PanelFooter funcNames={ ['onFlip', 'onConfirmed'] } btnTitles={ ['上一步', '完成'] } {...props}/>;
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
    console.log('2Step', props.onConfirmed);
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
                    <li className='clearfix'>
                      <div>摄像头1</div>
                      <div><span className='delete'></span></div>
                    </li>
                    <li className='clearfix'>
                      <div>摄像头1</div>
                      <div><span className='delete'></span></div>
                    </li>
                    <li className='clearfix'>
                      <div>摄像头1</div>
                      <div><span className='delete'></span></div>
                    </li>
                    <li className='clearfix'>
                      <div>摄像头1</div>
                      <div><span className='delete'></span></div>
                    </li>
                    <li className='clearfix'>
                      <div>摄像头1</div>
                      <div><span className='delete'></span></div>
                    </li>
                    <li className='clearfix'>
                      <div>摄像头1</div>
                      <div><span className='delete'></span></div>
                    </li>
                    <li className='clearfix'>
                      <div>摄像头1</div>
                      <div><span className='delete'></span></div>
                    </li>
                    <li className='clearfix'>
                      <div>摄像头1</div>
                      <div><span className='delete'></span></div>
                    </li>
                    <li className='clearfix'>
                      <div>摄像头1</div>
                      <div><span className='delete'></span></div>
                    </li>
                  </ul>
                </div>
              </div>
              { footer }
            </div>)
  }
}