import React from 'react';
import { DatePicker } from 'antd';

const ProgramHeader = (props) => {
  const { timeShaft, selectDate } = props;
  return (
    <div id="header-wapper">
      <div className="time-picker-wapper">
        <DatePicker className="time-picker" size="large" onChange={(date, dateString) => { selectDate(date, dateString); }}/>
      </div>  
      <ul id="header">  
        {timeShaft.map((item, index) => {
          return <li key={index} className="timeShaft-li">{item}</li>;
        })}
      </ul>
    </div>  
  );
};

export default ProgramHeader;