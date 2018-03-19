import React, { Component } from 'react';
import ProgramHeader from './header';
import ProgramShaft from './programShaft';
import { getNumberShaft, getTimeShaft } from './utils';

import '../../../../public/styles/playerProgram.less';

export default class PlayerProgram extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onClick = this.onClick.bind(this);
  }

  onClick() {}

  render() {
    // countShaft(startTime,endTime,Interval)
    // getTimeShaft(countShaft)
    const numberShaft = getNumberShaft(0, 24, 2);
    const timeShaft = getTimeShaft(numberShaft);
    const { programList = [{}] } = this.props;
    /** ProgramShaft -- props
      *  1. schedules: [{start:Number,end:Number}] --- Nothing to get a notice ~,just remember to keep order
      *  2. timeShaft: [startTime:Number,endTime:Number] --- TimeShaft should keep the same number for header
      *  3. color: String <Default 'gold'> --- ProgramShaft color
      *  4. name: String <Default '我已经天下无敌了！！！'> --- ProgramName
      *  5. scale: Not support yet!
    */
    const programShaftList = programList.map((program, index) => {
      return <ProgramShaft {...program} key={index} onClick={this.onClick}/>;
    });
    return (
      <div id="player-programmer">
        <ProgramHeader timeShaft={timeShaft} />
        <ul id="program-shaft">
          {programShaftList}
        </ul>
      </div>
    );
  }
}