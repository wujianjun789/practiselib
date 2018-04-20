/** Created By ChrisWen
 *  18/03/16
 *  ProgramShaft Container
 */
import React from 'react';

/** ProgramShaft -- props
 *  1. schedules: [{start:Number,end:Number}] --- Nothing to get a notice~,just remember to keep order
 *  2. totalSec: Number --- Total sec of timeShaft
 *  3. color: String <Default 'gold'> --- ProgramShaft color
 *  4. name: String <Default '我已经天下无敌了！！！'> --- ProgramName
 *  5. scale: Not support yet!
 */

const programShaftInitData = {
  schedules: [{ start: 0, end: 8 * 3600 }, { start: 10 * 3600, end: 12 * 3600 }, { start: 20 * 3600, end: 24 * 3600 }],
  totalSec: 24 * 3600,
  name: '我已经天下无敌了！！！',
  color: '#E6F7FF',
  borderColor:'#C3F0FC',
  fontColor:'#00BCFF',
  active:false,
  activeColor:'#00BCFF',
  activeBorderColor:'#00BCFF',
  activeFontColor:'white',
};

const { 
  schedules: initSchedules, 
  totalSec: initTotalSec, 
  name: initName, 
  color: initColor, 
  borderColor:initBorderColor, 
  fontColor:initFontColor,
  active:initActive,
  activeColor:initActiveColor,
  activeBorderColor:initActiveBorderColor,
  activeFontColor:initActiveFontColor,
} = programShaftInitData;

const ProgramShaft = (props) => {
  const {
    schedules = initSchedules,
    totalSec = initTotalSec,
    name = initName,
    color = initColor,
    borderColor = initBorderColor,
    fontColor = initFontColor,
    active = initActive,
    activeColor = initActiveColor,
    activeBorderColor = initActiveBorderColor,
    activeFontColor = initActiveFontColor,
    ...otherProps
  } = props;

  const programShaft = schedules.map((schedule, index) => {
    const { start, end } = schedule;
    const startPer = start / totalSec;
    const endPer = end / totalSec;
    const colorStyle = active ? { backgroundColor:activeColor, border:`1px solid ${activeBorderColor}`, color:activeFontColor} : { backgroundColor:color, border:`1px solid ${borderColor}`, color:fontColor};
    const style = { width: `${(endPer - startPer) * 100}%`, left: `${startPer * 100}%`, ...colorStyle };
    return (<div className="single-program" key={index} style={style}>{name}</div>);
  });
  return <li className="program-wrapper">
    <div className="base-border"/>
    {programShaft}
  </li>;
};

export default ProgramShaft;