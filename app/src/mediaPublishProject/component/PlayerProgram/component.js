import React, { Component } from 'react';
import ProgramHeader from './header';
import ProgramShaft from './programShaft';
import { countShaft, getTimeShaft  } from './utils';

import '../../../../public/styles/playerProgram.less';

const schedules = [{ start: 0, end: 12 }, {start:20, end: 24}];

const timeShaft = [0, 24];

export default class PlayerProgram extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  programShaft(schedules, timeShaft, index) {
    const totalMin = (timeShaft[1] - timeShaft[0]) * 60;
    const programShaft = schedules.map((schedule, _index) => {
      const { start, end } = schedule;
      // const duration = end - start;
      const startPer = (start * 60) / totalMin;
      const endPer = (end * 60) / totalMin;
      return <div
        className="single-program"
        key={_index}
        style={{ width: `${(endPer - startPer) * 100}%`, left: `${startPer * 100}%`}}>
      我已经天下无敌了!!!
      </div>;
    });
    return programShaft;
  }



  render() {
    const numberShaft = countShaft(0, 24, 2);
    const mockTime = getTimeShaft(numberShaft);
    return (
      <div id="player-programmer">
        <ProgramHeader timeShaft={mockTime} />
        <ul id="program-shaft">
          <ProgramShaft schedules={schedules} timeShaft={[0, 24]} index={0} />  
          <ProgramShaft schedules={schedules} timeShaft={[0, 24]} index={1} />
          <ProgramShaft schedules={schedules} timeShaft={[0, 24]} index={2} />    
        </ul>
      </div>
    );
  }
}