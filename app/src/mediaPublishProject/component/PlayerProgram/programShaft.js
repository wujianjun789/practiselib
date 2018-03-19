/** Created By ChrisWen
 *  18/03/16
 *  ProgramShaft Container
 */
import React from 'react';

/** ProgramShaft -- props
 *  1. schedules: [{start:Number,end:Number}] --- Nothing to get a notice~,just remember to keep order
 *  2. timeShaft: [startTime:Number,endTime:Number] --- TimeShaft should keep the same number for header
 *  3. color: String <Default 'gold'> --- ProgramShaft color
 *  4. name: String <Default '我已经天下无敌了！！！'> --- ProgramName
 *  5. scale: Not support yet!
 */

const programShaftInitData = {
  schedules: [{ start: 0, end: 8 }, { start: 10, end: 12 }, { start: 20, end: 24 }],
  timeShaft: [0, 24],
  name: '我已经天下无敌了！！！',
  color: 'gold',
};

const { schedules: initSchedules, timeShaft: initTimeShaft, name: initName, color: initColor } = programShaftInitData;

const ProgramShaft = (props) => {
  const {
    schedules = initSchedules,
    timeShaft = initTimeShaft,
    name = initName,
    color = initColor,
    ...otherProps
  } = props;

  const totalMin = (timeShaft[1] - timeShaft[0]) * 60;
  const programShaft = schedules.map((schedule, index) => {
    const { start, end } = schedule;
    const startPer = (start * 60) / totalMin;
    const endPer = (end * 60) / totalMin;
    const style = { width: `${(endPer - startPer) * 100}%`, left: `${startPer * 100}%`, backgroundColor:color };
    return (<div className="single-program" key={index} style={style}>{name}</div>);
  });
  return <li className="program-wrapper">{programShaft}</li>;
};

export default ProgramShaft;