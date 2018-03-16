import React from 'react';
const ProgramShaft = (props) => {
  const { schedules, timeShaft, index } = props;
  const totalMin = (timeShaft[1] - timeShaft[0]) * 60;
  const programShaft = schedules.map((schedule, _index) => {
    const { start, end } = schedule;
    // const duration = end - start;
    const startPer = (start * 60) / totalMin;
    const endPer = (end * 60) / totalMin;
    return <div
      className="single-program"
      key={_index}
      style={{ width: `${(endPer - startPer) * 100}%`, left: `${startPer * 100}%`, top: `${index * 60}` }}>
    我已经天下无敌了!!!
    </div>;
  });
  return <li className="program-wrapper">{programShaft}</li>;
};

export default ProgramShaft;