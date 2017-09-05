import React, { Component } from 'react';
import PanelFooter from '../../../components/PanelFooter.js';
import Select from '../../../components/Select.1.js';
import SearchText from '../../../components/SearchText.js';


export default class SecondStepComponet extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const props = this.props;
        const footer = <PanelFooter funcNames={ ['onFlip', 'onConfirm'] } btnTitles={ ['上一步', '完成'] } {...props}/>;
        return (<div id='secstep' className='clearfix'>
                  <span>选择设备:</span>
                  <div className='secstep_selectdevice-content clearfix'>
                    <div>
                      <Select className='secstep_selectdevice-select' />
                      <SearchText className='secstep_selectdevice-searchtext' />
                      <ul className='secstep_selectdevice-ul'>
                        <li className='clearfix'>
                          <div>摄像头1</div>
                          <div>已添加</div>
                        </li>
                        <li className='clearfix'>
                          <div>摄像头1</div>
                          <div>已添加</div>
                        </li>
                        <li className='clearfix'>
                          <div>摄像头1</div>
                          <div>已添加</div>
                        </li>
                      </ul>
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