import React, { Component } from 'react';
import ProgramHeader from './header';

import { countShaft, getTimeShaft  } from './utils';

import '../../../../public/styles/playerProgram.less';

const schedules = [{ start: 0, end: 12 }, {start:20, end: 24}];

export default class PlayerProgram extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  programShaft(schedules, numberShaft) {
    const programShaft = numberShaft.map((item) => {
      let extraClassName = '';
      schedules.forEach(schedule => {
        const condition1 = item > schedule.start && item < schedule.end;
        const condition2 = item === schedule.start || item === schedule.end;
        if (condition1 || condition2) {
          return extraClassName = 'active';
        }
      });
      return <div className={`base-block ${extraClassName}`} key={item}></div>;
    });
    return programShaft;
  }



  render() {
    const numberShaft = countShaft(0, 24, 2);
    const mockTime = getTimeShaft(numberShaft);
    return (
      <div id="player-programmer">
        <ProgramHeader timeShaft={mockTime} />
        <ul id="program-shaft">{this.programShaft(schedules, numberShaft)}</ul>
      </div>
    );
  }
}