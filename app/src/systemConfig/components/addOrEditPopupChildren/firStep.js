import React, { Component } from 'react';
import PanelFooter from '../../../components/PanelFooter.js';
import InputCheck from '../../../components/InputCheck.js';
import Select from '../../../components/Select.1.js';
import SearchText from '../../../components/SearchText.js';

export default class FirstStepComponet extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    const props = this.props;
    const footer = <PanelFooter funcNames={ ['onCancel', 'onFlip'] } btnTitles={ ['取消', '下一步'] } {...props}/>;
    return (<div id='first-step'>
              <ul className='clearfix'>
                <li>
                  <InputCheck label='路灯名称' className='lightName-input' />
                </li>
                <li>选择:
                  <Select/>
                  <SearchText/>
                </li>
              </ul>
              { footer }
            </div>)
  }
}