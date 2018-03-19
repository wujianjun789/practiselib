/** Created By ChrisWen
 *  18/03/17
 *  Utils function for playerProgramm
 */
import React from 'react';

function getNumberShaft(start, end, interval) {
  const countShaft = [];
  for (let i = start; i < end || i === end; i += interval) {
    countShaft.push(i);
  }
  return countShaft;
}

function getTimeShaft(countShaft) {
  const timeShaft = countShaft.map((number) => {
    let time = '';
    if (number < 10) {
      time = `0${number}:00`;
    } else {
      time = `${number}:00`;
    }
    return time;
  });
  return timeShaft;
}

function getProgramShaft(countShaft) {
  const programShaft = countShaft.map((item, index) => {
    return <div className="base-block" key={index}>{item}</div>;
  });
  return programShaft;
}

export {getNumberShaft, getTimeShaft, getProgramShaft};