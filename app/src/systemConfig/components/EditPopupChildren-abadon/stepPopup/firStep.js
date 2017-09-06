import React, { Component } from 'react';
import PanelFooter from '../../../../components/PanelFooter.js';
import InputCheck from '../../../../components/InputCheck.js';
import Select from '../../../../components/Select.1.js';
import SearchText from '../../../../components/SearchText.js';
import DeviceList from './list/index.js';

export default class FirstStepComponent extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    const props = this.props;
    const footer = <PanelFooter funcNames={ ['onCancel', 'onFlip'] } btnTitles={ ['取消', '下一步'] } {...props}/>;
    const data = [{
      name: '灯杆1',
      added: false
    }, {
      name: '灯杆2',
      added: false
    }, {
      name: '灯杆3',
      added: true
    }, {
      name: '灯杆4',
      added: false
    }];
    return (<div id='firstep'>
              <ul className='clearfix firstep-ul'>
                <li>
                  <InputCheck label='路灯名称' {...props}/>
                </li>
                <li className='clearfix'><span>选择灯杆:</span>
                  <div className='firstep_selectpole-content clearfix'>
                    <Select className='firstep_selectpole-select' />
                    <SearchText className='firstep_selectpole-searchtext' placeholder='输入灯杆名称' />
                    <DeviceList className='firstep_selectpole-ul' data={ data } operations={ ['添加', '已添加'] } />
                  </div>
                </li>
              </ul>
              { footer }
            </div>)
  }
}