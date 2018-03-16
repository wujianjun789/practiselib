import React from 'react';

const ProgramHeader = (props) => {
  const { timeShaft } = props;
  return (
    <ul id="header">
      {timeShaft.map((item, index) => {
        return <li key={index}>{item}</li>;
      })}
    </ul>
  );
};

export default ProgramHeader;