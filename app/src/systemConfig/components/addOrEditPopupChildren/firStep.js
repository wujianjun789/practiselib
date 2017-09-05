import React, { Component } from 'react';
import PanelFooter from '../../../components/PanelFooter.js';
import InputCheck from '../../../components/InputCheck.js';
import Select from '../../../components/Select.1.js';
import SearchText from '../../../components/SearchText.js';

export default class FirstStepComponet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '123'
    }
  }


  render() {
    const props = this.props;
    const footer = <PanelFooter funcNames={ ['onCancel', 'onFlip'] } btnTitles={ ['取消', '下一步'] } {...props}/>;
    return (<div id='firstep'>
              <ul className='clearfix firstep-ul'>
                <li>
                  <InputCheck label='路灯名称' {...props}/>
                </li>
                <li className='clearfix'><span>选择灯杆:</span>
                  <div className='firstep_selectpole-content clearfix'>
                    <Select className='firstep_selectpole-select' />
                    <SearchText className='firstep_selectpole-searchtext' />
                    <ul className='firstep_selectpole-list'>
                      <li className='clearfix'>
                        <div>灯杆1</div>
                        <div>选择</div>
                      </li>
                      <li className='clearfix'>
                        <div>灯杆1</div>
                        <div>选择</div>
                      </li>
                      <li className='clearfix'>
                        <div>灯杆1</div>
                        <div>选择</div>
                      </li>
                      <li className='clearfix'>
                        <div>灯杆1</div>
                        <div>选择</div>
                      </li>
                      <li className='clearfix'>
                        <div>灯杆1</div>
                        <div>选择</div>
                      </li>
                      <li className='clearfix'>
                        <div>灯杆1</div>
                        <div>选择</div>
                      </li>
                      <li className='clearfix'>
                        <div>灯杆1</div>
                        <div>选择</div>
                      </li>
                      <li className='clearfix'>
                        <div>灯杆1</div>
                        <div>选择</div>
                      </li>
                      <li className='clearfix'>
                        <div>灯杆1</div>
                        <div>选择</div>
                      </li>
                      <li className='clearfix'>
                        <div>灯杆1</div>
                        <div>选择</div>
                      </li>
                      <li className='clearfix'>
                        <div>灯杆1</div>
                        <div>选择</div>
                      </li>
                      <li className='clearfix'>
                        <div>灯杆1</div>
                        <div>选择</div>
                      </li>
                      <li className='clearfix'>
                        <div>灯杆1</div>
                        <div>选择</div>
                      </li>
                      <li className='clearfix'>
                        <div>灯杆1</div>
                        <div>选择</div>
                      </li>
                      <li className='clearfix'>
                        <div>灯杆1</div>
                        <div>选择</div>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
              { footer }
            </div>)
  }
}